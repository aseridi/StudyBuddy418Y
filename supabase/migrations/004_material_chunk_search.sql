drop index if exists public.idx_embeddings_vector;

create or replace function public.match_material_chunks(
  query_embedding vector(1536),
  p_course_id uuid,
  match_count int default 6
)
returns table (
  id uuid,
  material_id uuid,
  chunk_index int,
  chunk_text text,
  similarity float
)
language sql
stable
set search_path = public
as $$
  select
    me.id,
    me.material_id,
    me.chunk_index,
    me.chunk_text,
    1 - (me.embedding <=> query_embedding) as similarity
  from public.material_embeddings me
  where me.course_id = p_course_id
    and me.embedding is not null
  order by me.embedding <=> query_embedding
  limit match_count;
$$;