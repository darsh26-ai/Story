// Story data. These are original, kid-friendly retellings/fictional adventures.
// Add new stories by following the same object structure.

const STORY_DATA = [
  {
    id:"rama-bravery", region:"india", category:"mythology", character:"Rama",
    title:"Rama and the Forest Promise", icon:"🏹", color:"sun",
    description:"A gentle retelling about keeping promises, courage and kindness.",
    duration:3,
    text:"Long ago, Prince Rama lived in a kingdom filled with music and joy. One day, Rama learned that he would spend many years living in the forest. Rama was sad to leave his home, but he remembered an important promise. With a calm heart, he accepted the journey. Sita and Lakshmana chose to travel with him. As they walked beneath tall trees, Rama helped animals, listened to wise sages and protected travelers. He discovered that bravery does not mean never feeling afraid. Bravery means doing what is right even when a journey feels difficult. Each evening, Rama, Sita and Lakshmana shared stories beneath the stars. Rama learned that a loving heart can make even a strange forest feel like home. The lesson of their journey was simple: keep your promises, care for others and face challenges with courage."
  },
  {
    id:"krishna-butter", region:"india", category:"mythology", character:"Krishna",
    title:"Little Krishna and the Butter Pot", icon:"🦚", color:"blue",
    description:"A playful childhood tale about curiosity, sharing and a clever little friend.",
    duration:3,
    text:"In a cheerful village, little Krishna loved to explore. He especially loved the delicious butter made by the village mothers. One morning, Krishna spotted a pot hanging high above the floor. He called his friends and together they made a tiny human tower. Up went Krishna, carefully reaching for the pot. Plop! The pot came down, and everyone laughed. Krishna tasted the butter and then remembered his friends. Instead of keeping it all for himself, he shared it with everyone. Soon the butter pot was empty. When the village mothers discovered what had happened, Krishna smiled his most innocent smile. They could not stay angry for long. Krishna's adventure reminded everyone that sharing can turn a little treat into a happy memory. And from that day on, the children learned to ask before climbing for the butter!"
  },
  {
    id:"krishna-govardhan", region:"india", category:"mythology", character:"Krishna",
    title:"Krishna and the Great Mountain", icon:"🌄", color:"green",
    description:"A child-friendly tale about protecting a community and caring for nature.",
    duration:4,
    text:"One day, dark clouds gathered over the village of Vrindavan. Rain began to fall and the villagers worried about their homes and animals. Krishna encouraged everyone to stay together and help one another. In the traditional story, Krishna lifted Govardhan Hill and gave the villagers shelter beneath it. For seven days, the community stayed together, sharing food, caring for animals and comforting children. When the rain finally stopped, the people stepped outside into the fresh sunlight. Krishna reminded them that a strong community is built from kindness and cooperation. Everyone had helped someone else during the storm. The story became a joyful reminder to respect nature, look after animals and stand together when times are difficult."
  },
  {
    id:"ganesha-mango", region:"india", category:"mythology", character:"Ganesha",
    title:"Ganesha and the Race Around the World", icon:"🐘", color:"yellow",
    description:"A playful story about wisdom, family and seeing things in a different way.",
    duration:3,
    text:"One day, Ganesha and his brother were invited to race around the world. The winner would receive a special prize. His brother quickly prepared for a journey around the earth. Ganesha looked at the challenge and thought carefully. Then he walked around his parents three times and smiled. Everyone was surprised. Ganesha explained that for him, his parents represented his whole world. His answer showed that wisdom is not always about moving the fastest. Sometimes the best solution comes from stopping, thinking and understanding what really matters. The family laughed together, and Ganesha received the prize. The lesson is wonderful for young minds: use your brain, listen carefully and remember the people who make your world special."
  },
  {
    id:"shiva-blue-throat", region:"india", category:"mythology", character:"Shiva",
    title:"Shiva and the Blue-Throated Sky", icon:"🔱", color:"purple",
    description:"A gentle myth-inspired tale about courage, protection and selflessness.",
    duration:4,
    text:"In an ancient story, gods and celestial beings worked together to bring precious treasures from the cosmic ocean. But a dangerous poison appeared first, threatening all living beings. Everyone became frightened. Shiva stepped forward to protect the world. He held the poison safely so it would not harm creation. The story says that the poison left a blue mark around his throat. Because of this, Shiva is lovingly remembered as Neelkanth, the blue-throated one. For children, the story can be understood as a lesson about protecting others and using strength responsibly. It also reminds us that when a difficult problem appears, we should not panic. We can pause, ask for help and think about how our actions affect everyone around us."
  },
  {
    id:"hanuman-sun", region:"india", category:"mythology", character:"Hanuman",
    title:"Hanuman and the Shining Sun", icon:"🐒", color:"orange",
    description:"A playful childhood adventure about curiosity, energy and learning.",
    duration:3,
    text:"When Hanuman was very young, he was curious about everything around him. One morning he saw the bright sun rising in the sky. To his young eyes, it looked like a glowing golden fruit. Hanuman leaped toward it with great excitement. The celestial world noticed his amazing energy and learned that this little child had extraordinary courage. Hanuman's story is often remembered for his devotion, strength and determination. His childhood adventure teaches children that curiosity is wonderful when it is guided by wisdom. When we want to explore something new, we can ask questions, listen to grown-ups and use our energy safely. A curious heart can become a learning heart."
  },
  {
    id:"panchatantra-lion", region:"india", category:"folk", character:"Panchatantra",
    title:"The Lion and the Clever Rabbit", icon:"🦁", color:"orange",
    description:"A classic-style animal tale about using intelligence instead of force.",
    duration:4,
    text:"A proud lion frightened all the animals in a forest. Every day he demanded that one animal come to him. The animals were terrified. One day, a clever little rabbit was chosen. The rabbit arrived late. The lion roared and asked why. The rabbit explained that another lion had stopped him on the way and claimed to be the real king of the forest. Furious, the lion demanded to see this rival. The rabbit led him to a deep well. The lion looked down and saw his own reflection in the water. Believing it was another lion, he roared. The reflection roared back. Angry, the lion jumped toward the reflection and fell into the water. The animals were safe. The rabbit had defeated a powerful problem using patience and clever thinking. The lesson: intelligence and calm thinking can solve problems that strength cannot."
  },
  {
    id:"folk-thirsty-crow", region:"india", category:"folk", character:"Indian Folk Tale",
    title:"The Thirsty Crow", icon:"🐦", color:"sky",
    description:"A simple story about patience, creativity and never giving up.",
    duration:3,
    text:"On a hot afternoon, a thirsty crow searched everywhere for water. At last, he found a pot with a little water at the bottom. The crow tried to reach the water with his beak, but the water was too low. He could have given up, but instead he looked around and thought. Nearby were many small stones. The crow picked up one stone and dropped it into the pot. Then another. Slowly, the water rose. The crow continued until he could finally drink. His simple idea solved a difficult problem. The story teaches children that when the first solution does not work, we can try another. Patience, creativity and determination can help us find a way forward."
  },
  {
    id:"frozen-moon", region:"fantasy", category:"fantasy", character:"Frost Kingdom",
    title:"The Moonlit Ice Kingdom", icon:"❄️", color:"ice",
    description:"An original magical adventure about two sisters, courage and a frozen kingdom.",
    duration:4,
    text:"Beyond the Silver Mountains stood an enchanted ice kingdom where snowflakes glowed like tiny stars. Two sisters, Mira and Luma, cared deeply for one another. One winter evening, the kingdom's magical moon crystal began to lose its light. Without the crystal, spring could not return. Mira wanted to search alone, but Luma reminded her that brave adventures are better when friends work together. They crossed a sparkling bridge, helped a lost snow fox and climbed a quiet mountain. At the summit they discovered that the crystal was not broken. It was simply covered by a layer of dark ice created by fear. The sisters held hands and remembered happy moments. Their warmth melted the dark ice. The moon crystal shone again, and colorful northern lights filled the sky. They learned that love, teamwork and courage can bring light back to even the coldest place."
  },
  {
    id:"dragon-garden", region:"fantasy", category:"fantasy", character:"Magic Garden",
    title:"The Tiny Dragon's Garden", icon:"🐉", color:"mint",
    description:"An original fantasy story about friendship and caring for nature.",
    duration:4,
    text:"In a hidden garden lived a tiny green dragon named Pip. Pip could breathe only one tiny puff of warm air. The other dragons thought this was not very impressive. One morning, Pip discovered that the garden flowers were drooping because the magical stream had stopped flowing. The bigger dragons tried to move a giant stone blocking the stream, but it would not budge. Pip noticed a small opening underneath the stone. He crawled through, cleared a handful of pebbles and released a little trickle of water. The trickle became a stream, and the garden flowers lifted their heads. Everyone cheered. Pip realized that being useful does not mean being the biggest or strongest. Sometimes a small idea, carefully used, can make a very big difference."
  },
  {
    id:"star-princess", region:"fantasy", category:"moral", character:"Star Princess",
    title:"The Princess Who Shared the Stars", icon:"🌟", color:"pink",
    description:"A gentle bedtime fantasy about generosity and making others happy.",
    duration:3,
    text:"Princess Tara lived in a castle above the clouds. Every night, she could choose one magical star to place over her room. One evening, she noticed that a nearby village looked very dark. The villagers had lost their lanterns during a storm. Tara wondered if she should keep her brightest star. Then she remembered how happy a little light could make someone feel. She carried the star to the village and placed it high above the town. Its gentle glow helped everyone find their way home. The next night, Tara discovered something wonderful. The sky seemed to have even more stars than before. She realized that kindness is like light: when you share it, the world does not become darker. It becomes brighter."
  },
  {
    id:"friendly-tiger", region:"india", category:"moral", character:"Forest Friends",
    title:"The Tiger Who Learned to Listen", icon:"🐯", color:"gold",
    description:"A forest friendship story about listening before making decisions.",
    duration:3,
    text:"A young tiger named Aru was the fastest animal in his forest. Because he was fast, he often thought he was always right. One day, Aru heard a strange sound near the river and decided to investigate alone. His friend Mina the deer asked him to wait, but Aru rushed ahead. He discovered that the sound came from a baby elephant stuck between two fallen branches. Aru tried to pull the branches but could not. Mina and the other animals arrived and together they found a safe way to help. Aru thanked his friends. He learned that listening does not make you less brave. Listening helps you notice things you might miss. From that day forward, Aru still ran fast, but he also slowed down long enough to hear what his friends had to say."
  }
];

const REGION_DATA = [
  {id:"india",title:"India",icon:"🇮🇳",description:"Mythology, folk tales and timeless wisdom"},
  {id:"fantasy",title:"Fantasy World",icon:"🧚",description:"Original magical kingdoms and adventures"}
];

const CHARACTER_DATA = [
  {name:"Rama",icon:"🏹",storyId:"rama-bravery"},
  {name:"Krishna",icon:"🦚",storyId:"krishna-butter"},
  {name:"Ganesha",icon:"🐘",storyId:"ganesha-mango"},
  {name:"Shiva",icon:"🔱",storyId:"shiva-blue-throat"},
  {name:"Hanuman",icon:"🐒",storyId:"hanuman-sun"},
  {name:"Fantasy",icon:"❄️",storyId:"frozen-moon"}
];
