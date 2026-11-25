import React, { FormEvent, useEffect, useState } from 'react';
import { MessageCircle, Heart, Share2, Send, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

type CommentRow = {
  id: string;
  display_name: string;
  body: string;
  created_at: string;
};

interface ArticleEngagementProps {
  articleId: string;
  articleTitle: string;
}

function getVisitorId(): string {
  const key = 'dyoung_article_visitor_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

const numberLabel = (count: number) => count.toLocaleString();

export const ArticleEngagement: React.FC<ArticleEngagementProps> = ({ articleId, articleTitle }) => {
  const [visitorId, setVisitorId] = useState('');
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [shares, setShares] = useState(0);
  const [liked, setLiked] = useState(false);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const id = getVisitorId();
    setVisitorId(id);
    if (!supabase) return;

    let active = true;
    const load = async () => {
      const [likeCount, commentRows, shareCount, ownLike] = await Promise.all([
        supabase.from('article_likes').select('id', { count: 'exact', head: true }).eq('article_id', articleId),
        supabase.from('article_comments').select('id, display_name, body, created_at').eq('article_id', articleId).order('created_at', { ascending: false }).limit(100),
        supabase.from('article_shares').select('id', { count: 'exact', head: true }).eq('article_id', articleId),
        supabase.from('article_likes').select('id').eq('article_id', articleId).eq('visitor_id', id).maybeSingle()
      ]);
      if (!active) return;
      if (likeCount.error) console.error('Article likes could not load:', likeCount.error);
      if (commentRows.error) console.error('Article comments could not load:', commentRows.error);
      if (shareCount.error) console.error('Article shares could not load:', shareCount.error);
      setLikes(likeCount.count || 0);
      setComments((commentRows.data || []) as CommentRow[]);
      setShares(shareCount.count || 0);
      setLiked(Boolean(ownLike.data));
    };
    void load();
    return () => { active = false; };
  }, [articleId]);

  const toggleLike = async () => {
    if (!supabase || !visitorId) {
      setNotice('Article interactions are temporarily unavailable.');
      return;
    }
    const previous = liked;
    setLiked(!previous);
    setLikes(value => Math.max(0, value + (previous ? -1 : 1)));
    const result = previous
      ? await supabase.from('article_likes').delete().eq('article_id', articleId).eq('visitor_id', visitorId)
      : await supabase.from('article_likes').insert({ article_id: articleId, visitor_id: visitorId });
    if (result.error) {
      setLiked(previous);
      setLikes(value => Math.max(0, value + (previous ? 1 : -1)));
      setNotice(result.error.code === '23505' ? 'You have already liked this article.' : 'Could not update your like. Please try again.');
    } else {
      setNotice(previous ? 'Like removed.' : 'You liked this article.');
    }
  };

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanComment = comment.trim();
    if (!cleanName || !cleanComment) return;
    if (cleanName.length > 60 || cleanComment.length > 2000) {
      setNotice('Name must be 60 characters or fewer and comments 2,000 characters or fewer.');
      return;
    }
    if (!supabase || !visitorId) {
      setNotice('Comments are temporarily unavailable.');
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.from('article_comments').insert({
      article_id: articleId,
      visitor_id: visitorId,
      display_name: cleanName,
      body: cleanComment
    }).select('id, display_name, body, created_at').single();
    setSubmitting(false);
    if (error) {
      console.error('Article comment failed:', error);
      setNotice('Your comment could not be posted. Please try again.');
      return;
    }
    setComments(current => [data as CommentRow, ...current]);
    setComment('');
    setNotice('Your comment has been posted.');
  };

  const shareArticle = async () => {
    if (!supabase || !visitorId) {
      setNotice('Sharing is temporarily unavailable.');
      return;
    }
    setSharing(true);
    const url = window.location.href;
    let shared = false;
    try {
      if (navigator.share) {
        await navigator.share({ title: articleTitle, text: articleTitle, url });
        shared = true;
      } else {
        await navigator.clipboard.writeText(url);
        shared = true;
        setNotice('Article link copied. Share it with your friends.');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url);
          shared = true;
          setNotice('Article link copied. Share it with your friends.');
        } catch {
          setNotice('Could not share this article. Please copy the page address.');
        }
      }
    }
    if (shared) {
      const { error } = await supabase.from('article_shares').insert({
        article_id: articleId,
        visitor_id: visitorId
      });
      if (!error) setShares(value => value + 1);
      else console.error('Article share count could not be saved:', error);
    }
    setSharing(false);
  };

  return (
    <section className="max-w-3xl mx-auto mt-12 sm:mt-16 border-y border-[#EAE2D7] py-7 sm:py-9">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="font-serif text-xl sm:text-2xl text-[#291C16]">Join the Conversation</h2>
        <span className="text-[11px] text-[#8C6A48]">{numberLabel(comments.length)} comments</span>
      </div>

      <div className="grid grid-cols-3 border-y border-[#EAE2D7] divide-x divide-[#EAE2D7] mb-6">
        <button type="button" onClick={toggleLike} aria-pressed={liked} className={`py-4 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium transition-colors ${liked ? 'text-[#9B4A4A]' : 'text-[#4A3326] hover:text-[#8C6A48]'}`}>
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span>{liked ? 'Liked' : 'Like'} · {numberLabel(likes)}</span>
        </button>
        <a href="#article-comments" className="py-4 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium text-[#4A3326] hover:text-[#8C6A48]">
          <MessageCircle className="w-4 h-4" />
          <span>Comment · {numberLabel(comments.length)}</span>
        </a>
        <button type="button" onClick={shareArticle} disabled={sharing} className="py-4 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium text-[#4A3326] hover:text-[#8C6A48] disabled:opacity-50">
          {sharing ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>Share · {numberLabel(shares)}</span>
        </button>
      </div>

      {notice && <p role="status" className="text-xs text-[#8C6A48] mb-4">{notice}</p>}

      <form id="article-comments" onSubmit={submitComment} className="bg-white border border-[#EAE2D7] p-4 sm:p-5">
        <label htmlFor="article-comment-name" className="block text-[11px] uppercase tracking-wider text-[#8C6A48] mb-2">Your name</label>
        <input id="article-comment-name" value={name} onChange={event => setName(event.target.value)} maxLength={60} required placeholder="Enter your name" className="w-full border border-[#EAE2D7] bg-[#FDFCF7] px-3 py-3 text-sm text-[#291C16] outline-none focus:border-[#8C6A48] mb-4" />
        <label htmlFor="article-comment-body" className="block text-[11px] uppercase tracking-wider text-[#8C6A48] mb-2">Write a comment</label>
        <textarea id="article-comment-body" value={comment} onChange={event => setComment(event.target.value)} maxLength={2000} required rows={4} placeholder="Share your thoughts about this article..." className="w-full resize-y border border-[#EAE2D7] bg-[#FDFCF7] px-3 py-3 text-sm text-[#291C16] outline-none focus:border-[#8C6A48]" />
        <div className="flex justify-end mt-3">
          <button type="submit" disabled={submitting || !name.trim() || !comment.trim()} className="inline-flex items-center gap-2 bg-[#291C16] text-[#FDFCF7] px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#4A3326] disabled:opacity-50">
            <Send className="w-3.5 h-3.5" />{submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      <div className="mt-7 space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-[#8C6A48] text-center py-5">No comments yet. Be the first to share your thoughts.</p>
        ) : comments.map(item => (
          <article key={item.id} className="border-b border-[#EAE2D7] pb-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-sm font-semibold text-[#291C16]">{item.display_name}</span>
              <time className="text-[10px] text-[#9A8170]" dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString()}</time>
            </div>
            <p className="text-sm leading-relaxed text-[#4A3326] whitespace-pre-wrap break-words">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
