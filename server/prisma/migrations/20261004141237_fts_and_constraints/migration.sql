-- The plain nullable columns created by the init migration from the
-- Unsupported("tsvector") fields are replaced by generated columns.
ALTER TABLE blogs DROP COLUMN search_vector;
ALTER TABLE facts DROP COLUMN search_vector;

-- Full-text search (weights: title > excerpt > content)
ALTER TABLE blogs ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')),   'A') ||
  setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED;
CREATE INDEX blogs_search_idx ON blogs USING GIN (search_vector);

ALTER TABLE facts ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(text, ''))
) STORED;
CREATE INDEX facts_search_idx ON facts USING GIN (search_vector);

-- Tag filtering
CREATE INDEX blogs_tags_idx ON blogs USING GIN (tags);

-- A report must target exactly one thing
ALTER TABLE reports ADD CONSTRAINT reports_one_target CHECK (
  (blog_id IS NOT NULL)::int + (fact_id IS NOT NULL)::int + (comment_id IS NOT NULL)::int = 1
);

-- A bookmark of type BLOG/FACT must carry the matching id
ALTER TABLE bookmarks ADD CONSTRAINT bookmarks_target_consistent CHECK (
  (type = 'BLOG' AND blog_id IS NOT NULL) OR
  (type = 'FACT' AND fact_id IS NOT NULL) OR
  (type IN ('APOD', 'LAUNCH') AND blog_id IS NULL AND fact_id IS NULL)
);
