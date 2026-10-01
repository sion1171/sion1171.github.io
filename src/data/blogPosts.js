// Blog posts are English-only — shared across both languages
export const blogPosts = [
  {
    slug: 'why-rag-beats-ml-for-product-classification',
    date: '2026-04-16',
    title: 'Why We Chose RAG Over Traditional ML for Food Product Classification',
    summary: 'How we built a RAG-based classifier that cut costs by 99.7% and boosted accuracy by 45% — and why conventional ML couldn\'t do it.',
    tags: ['RAG', 'LLM', 'NLP', 'Product Classification'],
    content: [
      'At [Tridge](https://www.tridge.com/), we process millions of trade transactions from around the world. Each transaction comes with a raw product description — messy, multilingual, often abbreviated — that needs to be mapped to the correct category in our proprietary product hierarchy, the Tridge Ontology. It has roughly 4,000 top-level categories and around 11,000 nodes in total when you include every sub-level. Getting this wrong means bad data downstream: flawed market reports, broken analytics, and misinformed trade decisions.',

      { type: 'image-row', images: [
        { src: '/blog/tridge-products.webp', alt: 'Tridge product taxonomy browse view', caption: 'Browsing product categories on Tridge — from fruits to dairy, coffee, and beyond.' },
        { src: '/blog/tridge-prices.webp', alt: 'Tridge domestic price explorer', caption: 'Once classified, products feed into market intelligence — weekly prices for Fresh Hass Avocado.' }
      ] },

      'This is a product classification problem, and we didn\'t arrive at our current solution overnight. It took years of iteration — and failure — to get here.',

      '## The Road to RAG: What We Tried First',

      '**Manual labeling (circa 2021).** In the early days, human annotators classified every product by hand. This was accurate when done well, but it didn\'t scale. Worse, different annotators made different judgment calls on ambiguous products — "frozen shrimp" might end up under raw seafood or processed food depending on who labeled it. Consistency was impossible to enforce across a team, and the cost per classification was high.',

      '**Traditional ML.** We moved to supervised machine learning — the standard playbook: collect labeled data, extract text features, train a multi-class classifier, and deploy. This worked brilliantly for common products but fell apart on the long tail. With 11,000 categories, many had too few training examples. The model confidently misclassified edge cases, and every ontology update required expensive retraining cycles.',

      '**LLM-only approach.** When large language models became available, we tried feeding the entire Tridge Ontology into a prompt and letting the LLM classify directly. The accuracy was promising, but the cost was astronomical — processing thousands of categories per classification, multiple times per second, across millions of transactions. It simply wasn\'t viable at production scale.',

      'Each approach taught us something. Manual labeling showed us the importance of domain rules. Traditional ML showed us the limits of statistical pattern matching on noisy, long-tailed data. The LLM-only approach showed us that reasoning ability was the missing piece — we just needed to make it affordable. That\'s what led us to RAG.',

      '## Why Previous Approaches Failed',

      'To understand why RAG works, it helps to see exactly where the earlier methods broke down:',

      '**1. The ontology changes constantly.** The Tridge Ontology isn\'t static. New categories get added, existing ones get split or merged, descriptions get refined. Every time it changes, a supervised ML model needs to be retrained on new labeled data. With 11,000 categories evolving in parallel, this happened frequently enough that we were spending more time maintaining the model than building features.',

      '**2. The class distribution is brutally long-tailed.** We have thousands of product categories. Some — like raw beef or fresh apples — have thousands of labeled examples. Others — like seed maize or malted barley extract — have a handful. Traditional classifiers struggle with this imbalance. You either undersample the head (losing signal) or oversample the tail (overfitting to noise). Neither is great.',

      '**3. Trade descriptions are not product titles.** In e-commerce, a product title is written to be understood: "Apple iPhone 15 Pro Max 256GB Black." In international trade, a product description looks like this: "FRZ BNLS BUFFALO MEAT NCK 20KG CTNS AL-SAMI APEDA/181." These are full of abbreviations, HS code references, packaging specs, and sometimes multiple languages in the same line. A model trained on clean labels chokes on this.',

      '**4. Domain rules can\'t be learned from data alone.** Is "frozen beef" a raw product or a processed product? In common sense, freezing feels like processing. But in commodity trade standards, freezing is preservation — not processing. "Frozen beef" is raw beef. This distinction matters for classification, but no amount of training data will reliably teach a statistical model this rule. It needs to be explicitly encoded.',

      '## The RAG Solution',

      'RAG — Retrieval-Augmented Generation — combines the best of what we learned. Instead of training a model to memorize boundaries across thousands of categories, we let the system look up the most relevant ones at query time and then reason about which one fits best. It gives us the reasoning power of an LLM without the astronomical cost of feeding it the entire ontology.',

      'Our pipeline works in five stages:',

      { type: 'image', src: '/blog/pipeline.svg', alt: 'RAG Classification Pipeline', caption: 'The full classification pipeline: from raw trade description to standardized product category.' },

      '**Stage 1: Normalize.** An LLM takes the raw trade description and produces a clean, standardized product description. "FRZ BNLS BUFFALO MEAT NCK" becomes "Frozen Boneless Buffalo Meat Neck." This step alone eliminates most of the noise that kills traditional classifiers.',

      '**Stage 2: Embed.** The normalized description is converted into a high-dimensional vector using an embedding model. This numerical representation captures the semantic meaning of the product, enabling similarity-based search against the Tridge Ontology.',

      '**Stage 3: Retrieve.** We search the Tridge Ontology using cosine similarity (pgvector). This returns the top candidate categories — typically 10-15 options out of 11,000. This narrows the search space fast and cheap.',

      '**Stage 4: Classify.** An LLM receives the original description, the candidate categories, and domain-specific rules, then selects the best match. This is the critical step — the LLM can reason about edge cases, apply domain rules, and handle ambiguity in ways that a statistical classifier simply cannot.',

      '**Stage 5: Drill down.** The system recursively navigates the ontology hierarchy, selecting sub-categories at each level until it reaches the most specific match or decides it doesn\'t have enough information to go deeper.',

      '## The Key Insight: Retrieve First, Reason Second',

      'The architecture is intentionally split. Vector search handles what it\'s good at — finding semantically similar items from a large set, fast and cheap. LLMs handle what they\'re good at — reasoning about edge cases with injected domain knowledge.',

      'Neither component alone would work. Pure vector search returns plausible candidates but can\'t distinguish between "raw beef" and "processed beef" when both are semantically close to "frozen beef." Pure LLM classification — feeding all 11,000 categories into a prompt — is too expensive and unreliable (context window limits, attention degradation over thousands of options).',

      'But together, they\'re remarkably effective. Retrieval narrows 11,000 categories to 10-15 candidates. The LLM only reasons over that shortlist. Cost per classification: under $0.002.',

      { type: 'image', src: '/blog/ontology-tree.svg', alt: 'Tridge Ontology Hierarchy', caption: 'A simplified view of the Tridge Ontology. Red path shows how "frozen boneless buffalo meat" is classified through the hierarchy.' },

      '## Edge Cases: Where Domain Knowledge Matters Most',

      'The thing that convinced us RAG was the right call was how naturally it handles edge cases. In our domain, these aren\'t rare — they\'re the rule:',

      '**Frozen ≠ Processed.** "Frozen salmon" is raw salmon, not processed. "Frozen" is preservation. Our system injects this rule directly into the LLM prompt when seafood or meat categories are among the candidates.',

      '**Coffee bean ambiguity.** In commodity trade, "coffee bean" without a roasting indicator means green (unroasted). "Arabica beans" → green coffee bean. "Ground coffee" → roasted (grinding implies post-roast processing). A classifier trained on consumer product data would get this wrong every time.',

      '**Butter fat content.** Natural butter must be ≥80% milk fat by trade standards. If a product is described as a butter blend with other fats, it\'s a different category entirely. This is a legal/regulatory distinction, not a semantic one.',

      'With traditional ML, encoding these rules means feature engineering hacks — adding regex-based flags, building rule-based post-processing pipelines, maintaining a growing list of exceptions. With RAG, we just add the rule to the prompt. The LLM reads it, understands it, and applies it. When a new edge case emerges, we add a few lines of text. No retraining, no redeployment of model weights.',

      '## A Real Example',

      'Here\'s an actual classification from our production system. The input is a raw Korean trade description: "와일드 아이돌 논알코올 스파클링 ROSÉ 3 container 500 bottles." A human reader might guess this is sparkling wine, but the product is actually non-alcoholic — a distinction that matters for trade classification. The system needs to see past the Korean text, the shipping metadata, and the misleading "sparkling rosé" phrasing to land on the correct category.',

      { type: 'image', src: '/blog/classification-example.svg', alt: 'Classification example: Korean non-alcoholic sparkling rosé', caption: 'Real classification: from a raw Korean trade description through candidate retrieval to final hierarchical category.' },

      'The retrieval stage narrows the entire Tridge Ontology down to a handful of plausible candidates — notice how the vector search correctly identifies beverage-related categories but can\'t distinguish between alcoholic and non-alcoholic variants on its own. The LLM then selects the right top-level category and drills down through three levels to reach the exact match.',

      '## Results',

      'I started building this pipeline in April 2025. After months of iteration — rewriting retrieval logic, tuning prompts, stress-testing edge cases, and validating against production data — the system was fully deployed to production in October 2025. It has been running reliably in production ever since, classifying tens of thousands of trade records every week.',

      'The numbers speak for themselves:',

      '- **Cost dropped by 99.7%.** The previous system\'s per-classification cost was orders of magnitude higher. Our RAG pipeline runs at ~$0.002 per classification.',
      '- **Accuracy improved by 45%, now exceeding 95%.** Especially on long-tail categories and edge cases that the old system consistently misclassified.',
      '- **Ontology updates take minutes, not weeks.** When a new category is added to the Tridge Ontology, we generate its embedding and it\'s immediately searchable. Edge case rules are added as prompt text. No model retraining needed.',
      '- **Multilingual inputs work out of the box.** The LLM normalization step handles descriptions in English, Spanish, Japanese, Korean — without separate language-specific models.',

      '## When Traditional ML Still Wins',

      'To be clear: RAG isn\'t universally better. If your taxonomy is small and stable, your labels are clean, your class distribution is balanced, and your input text is well-structured, a fine-tuned BERT or even a simpler model will be faster, cheaper, and perfectly accurate. E-commerce product categorization is a great example.',

      'RAG shines when: the ontology is large and evolving, the input is noisy and multilingual, domain rules are critical, and the cost of misclassification is high. That was exactly our situation — the Tridge Ontology with 11,000 categories across global agricultural trade.',

      '## Takeaways',

      'If you\'re building a classification system and hitting the limits of traditional ML, consider whether your problem shares these characteristics: a large and evolving ontology, noisy multilingual input, hard domain rules, and a long-tailed category distribution. If it does, RAG might not just be an alternative — it might be the only approach that works reliably at scale.',

      'The key architectural insight is separating retrieval from reasoning. Let vector search do the fast filtering across thousands of categories. Let LLMs do the careful thinking on the shortlist. And let domain rules live as text that humans can read and update — not as weights buried in a model checkpoint.'
    ]
  },
  {
    slug: 'vibe-coding-is-harder-than-it-looks',
    date: '2026-04-17',
    title: 'Why Vibe Coding Is Harder Than It Looks',
    summary: 'AI didn\'t make my job easier. It made my job bigger. A reflection on how startup engineering roles are quietly transforming.',
    tags: ['AI', 'Startups', 'Engineering Culture', 'Reflection'],
    content: [
      'Siddhant Khare recently wrote a piece called [AI fatigue is real and nobody talks about it](https://siddhantkhare.com/writing/ai-fatigue-is-real). It resonated with me more than any technical blog post has in a while. Not because of the tooling advice — though that was solid — but because he named something I\'d been feeling but couldn\'t articulate: the work got faster, but I got more tired.',

      'I want to share my own version of this, from the perspective of someone working at an agri-trade startup where "AI engineer" no longer means what it used to.',

      '## The Job Description Changed',

      'A year ago, my role was clear. I built AI pipelines — data processing, model training, prompt engineering. I\'d hand off the results to data engineers or backend engineers, they\'d integrate it into the product, and we\'d ship. The boundary between "AI work" and "product work" was well-defined.',

      'That boundary no longer exists.',

      'Today, when I build a feature, I\'m expected to deliver the whole thing. Not just the model or the pipeline — the UI, the deployment, the monitoring. A task that used to be "build a classification endpoint" is now "build the classification feature." The API isn\'t the deliverable anymore. The working product is.',

      'This isn\'t because management decided to cut headcount. It\'s because AI tools made it possible for one person to do what used to take a small team. And once it\'s possible, it becomes expected.',

      '## 1-2 Weeks Became 1-2 Days',

      'Here\'s the thing about vibe coding that nobody warns you about: it actually works. I can scaffold a React component, wire up an API route, write database queries, and deploy — all in a fraction of the time it used to take. Claude Code, Cursor, Copilot — these tools genuinely compress the production timeline.',

      'A feature that would have taken me two weeks now takes two days. That sounds amazing. And it is — the first time. But then you realize: the sprint didn\'t get shorter. It got filled with more features. The velocity went up, so the expectations went up. You\'re not doing less work in less time. You\'re doing more work in the same time.',

      'Khare nailed this: "AI removed the governor that natural work pace once provided."',

      '## From Specialist to Generalist (Whether You Like It or Not)',

      'In a startup, this shift is especially brutal. There\'s no large team to absorb the expanded scope. When AI makes it feasible for one engineer to own a full vertical, that\'s exactly what happens. You become a team of one.',

      'I went from "the person who builds the AI pipeline" to "the person who builds the product." That includes the pipeline, the API, the frontend, the deployment, and handling VOC when users report issues. AI didn\'t replace my job. It replaced my teammates\' involvement in my projects.',

      'This is the part that the "10x engineer" narrative misses. Yes, I ship faster. But I also review my own code, debug my own frontend, write my own tests, and maintain my own infrastructure. The surface area of responsibility grew faster than the productivity gains.',

      '## What Actually Helps',

      'I\'m not writing this to complain. I genuinely believe AI tools have made me more capable. But capability without sustainability is just a burnout timeline. Here\'s what\'s worked for me:',

      '**Draw the line between "can" and "should."** Just because I can build the frontend doesn\'t mean I should always do it alone. Knowing when a task requires dedicated frontend expertise — and delegating accordingly — is just as important as being able to ship it yourself.',

      '**Accept that "good enough" ships.** Khare\'s advice about accepting 70% quality from AI drafts applies to the whole product, not just code. Perfectionism at startup speed is a trap.',

      '## The Uncomfortable Truth',

      'The uncomfortable truth is that AI didn\'t make my job easier. It made my job bigger. The tools are incredible — I can build things today that would have been impossible two years ago. But the human cost is real, and it\'s mostly invisible because everyone\'s too busy shipping to talk about it.',

      'If you\'re an AI engineer at a startup and you feel like you\'re doing three people\'s jobs, you probably are. That\'s not impostor syndrome. That\'s the new normal. The question isn\'t whether to use AI — it\'s how to use it without losing yourself in the process.',

      'Take care of your brain. Like Khare said: it\'s the only one you\'ve got.'
    ]
  }
]
