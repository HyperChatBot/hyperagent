// Run `pnpm tsx ./src/lib/embeddings/index.ts` in root directory.

import posts from '../../../sample-data/posts.json'
import { createPost } from './posts'

async function main() {
  for (const post of posts) {
    await createPost(post)
  }
}

main()
