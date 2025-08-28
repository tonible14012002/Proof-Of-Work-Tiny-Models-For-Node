export const DTYPE_OPTIONS = [
  { value: "auto", label: "auto" },
  { value: "bnb4", label: "bnb4" },
  { value: "fp16", label: "fp16" },
  { value: "fp32", label: "fp32" },
  { value: "int8", label: "int8" },
  { value: "q4", label: "q4" },
  { value: "q4f16", label: "q4f16" },
  { value: "q8", label: "q8" },
  { value: "uint8", label: "uint8" },
] as const;

export type DType = (typeof DTYPE_OPTIONS)[number]["value"];

import type { ModelDetail } from "@/schema/model";

// Only include task types that have example prompts
export type TaskWithExamples = Extract<ModelDetail["task"], 
  | "summarization"
  | "sentiment-analysis"
  | "zero-shot-classification"
  | "token-classification"
  | "text-classification"
  | "automatic-speech-recognition"
  // | "text2text-generation"
>;

export const EXAMPLE_PROMPTS: Record<TaskWithExamples, string[]> = {
  "summarization": [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once. Pangrams are often used to display font samples and test keyboards. They serve as a useful tool for typographers and designers who need to see how different fonts render all the letters of the alphabet in a single, coherent sentence. The most famous English pangram is 'The quick brown fox jumps over the lazy dog,' which has been used since the late 19th century. This particular pangram is popular because it's relatively short while still containing all 26 letters of the English alphabet. Other languages have their own pangrams, and they're used in similar contexts for font testing and keyboard layout verification.",
    "Artificial intelligence has transformed the way we interact with technology in profound and unprecedented ways. From virtual assistants like Siri and Alexa that respond to voice commands, to recommendation systems that suggest products, movies, and music based on our preferences, AI is becoming increasingly integrated into our daily lives. Machine learning algorithms can now process vast amounts of data to make predictions and automate complex tasks that were previously impossible or extremely time-consuming. In healthcare, AI systems can analyze medical images to detect diseases earlier and more accurately than human doctors. In finance, AI algorithms can detect fraudulent transactions in real-time and make investment decisions based on market patterns. In transportation, self-driving cars use AI to navigate roads safely and efficiently. The field of natural language processing has advanced to the point where AI can understand and generate human language with remarkable fluency, enabling applications like automated customer service, language translation, and content creation. As AI technology continues to evolve, we're seeing new applications emerge in fields as diverse as agriculture, education, entertainment, and scientific research.",
    "Climate change represents one of the most significant challenges facing humanity today, with far-reaching implications for our planet's ecosystems, economies, and societies. Rising global temperatures, melting ice caps, and extreme weather events are just some of the observable effects that scientists have documented over the past several decades. The Intergovernmental Panel on Climate Change (IPCC) has reported that global temperatures have already risen by approximately 1.1 degrees Celsius above pre-industrial levels, and we're on track to exceed the critical 1.5-degree threshold within the next decade if current trends continue. This warming is causing sea levels to rise at an accelerating rate, threatening coastal communities and island nations around the world. The melting of polar ice caps and glaciers is not only contributing to sea level rise but also disrupting ocean currents and weather patterns. Extreme weather events such as hurricanes, droughts, floods, and heatwaves are becoming more frequent and intense, causing billions of dollars in damage and displacing millions of people annually. Scientists warn that immediate action is necessary to reduce greenhouse gas emissions and transition to renewable energy sources if we hope to avoid the most catastrophic impacts of climate change. This requires coordinated global efforts to implement policies that promote clean energy, improve energy efficiency, protect forests and other carbon sinks, and develop new technologies for carbon capture and storage.",
    "The history of the internet dates back to the 1960s when ARPANET was developed by the United States Department of Defense as a means of creating a decentralized communication network that could survive nuclear attacks. This early network connected computers at universities and research institutions, allowing scientists to share data and collaborate on research projects. The development of TCP/IP protocols in the 1970s provided the foundation for the modern internet by establishing a standardized way for different networks to communicate with each other. The 1980s saw the creation of the Domain Name System (DNS), which made it easier for users to navigate the internet using human-readable addresses instead of numerical IP addresses. The World Wide Web, invented by Tim Berners-Lee in 1989, revolutionized the internet by introducing hypertext and web browsers, making it accessible to non-technical users. The 1990s marked the beginning of the commercial internet, with the emergence of e-commerce, search engines, and social media platforms. Over the decades, the internet has evolved from a simple network for sharing research data to a global platform that connects billions of people worldwide, enabling instant communication, information sharing, entertainment, education, and commerce on an unprecedented scale. Today, the internet has become an essential infrastructure for modern society, with mobile devices and the Internet of Things (IoT) expanding its reach even further.",
    "Space exploration has captured human imagination for centuries, representing our innate desire to understand the universe and our place within it. From the first moon landing in 1969, when Neil Armstrong took his historic 'giant leap for mankind,' to the recent Mars rover missions that have revealed the Red Planet's secrets, our quest to explore space continues to push the boundaries of what's possible. The Apollo program, which successfully landed 12 astronauts on the moon between 1969 and 1972, demonstrated humanity's ability to overcome seemingly insurmountable technical challenges and inspired generations of scientists, engineers, and dreamers. The Space Shuttle program, which operated from 1981 to 2011, made space travel more routine and enabled the construction of the International Space Station (ISS), a remarkable example of international cooperation that has been continuously inhabited since 2000. Robotic missions have explored every planet in our solar system, with spacecraft like Voyager 1 and 2 now traveling through interstellar space, carrying messages from Earth to potential extraterrestrial civilizations. The Hubble Space Telescope has revolutionized our understanding of the universe by capturing stunning images of distant galaxies, nebulae, and other celestial objects. More recently, missions like the James Webb Space Telescope and the Perseverance rover on Mars are continuing to expand our knowledge of the cosmos and search for signs of life beyond Earth. Private companies like SpaceX, Blue Origin, and Virgin Galactic are now entering the space industry, promising to make space travel more accessible and affordable for ordinary people."
  ],
  "sentiment-analysis": [
    "I absolutely love this product! It's amazing and works perfectly.",
    "This is the worst experience I've ever had. Terrible service and poor quality.",
    "The movie was okay, nothing special but not bad either.",
    "I'm so excited about the new features! This update is fantastic!",
    "The food was mediocre and overpriced. I wouldn't recommend it."
  ],

  "zero-shot-classification": [
    "Hey, can you send me $50 for the dinner we had last night?",
    "I need to pay my rent of $1,200 by the end of the month.",
    "The weather is beautiful today, perfect for a picnic.",
    "Can you help me fix my computer? It's not working properly.",
    "I just paid $89.99 for my monthly gym membership.",
    "The movie was entertaining and well-directed.",
    "I'm going to the park to enjoy the sunshine.",
    "Please process the payment of $299.99 for my online order.",
    "I love reading science fiction novels in my free time.",
    "The restaurant was crowded and the service was slow.",
    "I need to transfer $500 to my savings account.",
    "The concert last night was amazing!",
    "Can you refund the $75.50 to my credit card?",
    "I'm planning a vacation to Europe next summer.",
    "The food at the restaurant was delicious.",
    "Hey, don't forget to pay me back the $25 for lunch!",
    "The sunset was absolutely breathtaking.",
    "I need to check my bank balance before making any purchases.",
    "Can you help me troubleshoot this software installation issue?",
    "I'm looking for a good restaurant recommendation for tonight."
  ],
  "token-classification": [
    "Apple CEO Tim Cook announced new products at the WWDC conference in San Francisco on June 5th, 2023.",
    "The United Nations headquarters in New York City hosted a meeting between President Biden and Prime Minister Johnson.",
    "Dr. Emily Chen from Stanford University published research in Nature journal about climate change impacts.",
    "The flight from London Heathrow to JFK Airport departs at 14:30 on December 15th, 2024.",
    "Contact Professor Michael Rodriguez at m.rodriguez@mit.edu or call +1-555-123-4567 for the research collaboration.",
    "Microsoft Corporation released Windows 11 on October 5th, 2021, with new features for productivity.",
    "The European Union Parliament in Brussels approved new regulations on artificial intelligence on March 15th, 2024.",
    "NASA's Perseverance rover landed on Mars on February 18th, 2021, at Jezero Crater.",
    "Dr. Sarah Williams from Harvard Medical School presented findings at the American Medical Association conference.",
    "The Tokyo Olympics were held from July 23rd to August 8th, 2021, despite COVID-19 challenges.",
    "Tesla CEO Elon Musk announced plans to build a new Gigafactory in Austin, Texas by 2025.",
    "The World Health Organization issued guidelines on pandemic preparedness on January 10th, 2023.",
    "Professor David Kim from MIT published a paper in Science journal about quantum computing breakthroughs.",
    "The G20 Summit took place in Bali, Indonesia on November 15th-16th, 2022.",
    "Contact Dr. Lisa Thompson at lisa.thompson@oxford.ac.uk for collaboration on renewable energy research."
  ],
  "text-classification": [
    "This company's quarterly earnings exceeded expectations, driving stock prices up 15%.",
    "The new product launch was a complete disaster and customers are demanding refunds.",
    "The quarterly report shows mixed results with some positive indicators but concerning trends.",
    "This is absolutely disgusting and I hate everything about it.",
    "The financial markets are showing strong growth potential for the upcoming year.",
    "The merger announcement caused investor confidence to soar, with shares jumping 25%.",
    "This service is terrible and the customer support is completely useless.",
    "The earnings call revealed disappointing revenue figures, causing market uncertainty.",
    "You're an idiot and I hope you fail miserably at everything you do.",
    "The company's innovative approach to renewable energy shows promising market potential.",
    "This product is overpriced garbage that nobody should waste their money on.",
    "The quarterly results were better than expected, indicating strong business fundamentals.",
    "I'm so frustrated with this terrible experience and poor service quality.",
    "The financial outlook appears stable with moderate growth projections for Q4.",
    "This is the worst decision ever made by this incompetent management team."
  ],
  "automatic-speech-recognition": [
    "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
    "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav",
    "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav",
    "https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/mlk.flac",
    "https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/1272-141231-0002.mp3"
  ],
  // "text2text-generation": [
  //   "Translate this text to French: Hello, how are you today?",
  //   "Summarize the following article: Artificial intelligence has transformed many industries...",
  //   "Generate a creative story about a robot learning to paint.",
  //   "Answer this question: What is the capital of Japan?",
  //   "Rewrite this sentence in a more formal tone: Hey, can you help me with this?"
  // ]
};


