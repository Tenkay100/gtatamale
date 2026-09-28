export interface Mission {
  id: number;
  title: string;
  description: string;
  location: string;
  locationX: number;
  locationY: number;
  reward: number;
  completed: boolean;
  dialogue: string[];
  objective: string;
}

export const storyIntro = [
  "TAMALE, GHANA - 2024",
  "",
  "After 10 years in the States, Kwame Mensah returns to his hometown of Tamale.",
  "The city has changed. New roads, new faces, new dangers.",
  "",
  "His father, Alhaji Mensah, was once the most respected businessman in the Northern Region.",
  "But something went wrong. The family business collapsed. His father disappeared.",
  "",
  "Now Kwame is back, with nothing but a letter from his father and a burning need for answers.",
  "",
  "The streets of Tamale hold secrets... and the people who took everything from his family",
  "are still walking free.",
  "",
  "It's time to take back what's his. It's time for REVENGE.",
  "",
  "Welcome to GTA: TAMALE VICE"
];

export const missions: Mission[] = [
  {
    id: 1,
    title: "Homecoming",
    description: "Find your way to your old neighborhood in Tamale New Town",
    location: "Tamale New Town",
    locationX: 200,
    locationY: 350,
    reward: 500,
    completed: false,
    dialogue: [
      "Kwame: 'So this is Tamale now... barely recognize the place.'",
      "Kwame: 'Dad's letter said to go to the old house in New Town.'",
      "Kwame: 'Let me find my way there first. Need to get my bearings.'",
      "Old Man: 'Eh! Kwame? Is that you, Alhaji's boy?'",
      "Kwame: 'Uncle Ibrahim? You remember me!'",
      "Old Man: 'Your father... he was a good man. Go to the house. I left something for you there.'"
    ],
    objective: "Navigate to Tamale New Town"
  },
  {
    id: 2,
    title: "The Market Meet",
    description: "Go to Tamale Central Market to meet your contact Amina",
    location: "Central Market",
    locationX: 450,
    locationY: 280,
    reward: 1000,
    completed: false,
    dialogue: [
      "Kwame: 'Uncle Ibrahim left me a note. Says to find Amina at the market.'",
      "Kwame: 'She knows what happened to my father.'",
      "Amina: 'Kwame! Finally you're here. Your father got mixed up with dangerous people.'",
      "Kwame: 'Who? Tell me everything.'",
      "Amina: 'The Dagbon Cartel. They run everything now - the market, the transport, the land deals.'",
      "Amina: 'Your father refused to sell his properties to them. That's when he disappeared.'",
      "Kwame: 'Then I'll tear them down. Piece by piece.'"
    ],
    objective: "Meet Amina at Central Market"
  },
  {
    id: 3,
    title: "First Blood",
    description: "Confront the Dagbon Cartel scouts near the Teaching Hospital",
    location: "Teaching Hospital Area",
    locationX: 650,
    locationY: 180,
    reward: 2000,
    completed: false,
    dialogue: [
      "Amina: 'The Cartel has scouts posted near the hospital. They're watching everything.'",
      "Kwame: 'Time to send them a message.'",
      "Cartel Scout: 'Who are you? This is our territory!'",
      "Kwame: 'Tell your bosses that Kwame Mensah is back. And I'm taking everything back.'",
      "Cartel Scout: 'You're a dead man, Mensah!'",
      "Kwame: 'We'll see about that...'"
    ],
    objective: "Confront Cartel scouts near the hospital"
  },
  {
    id: 4,
    title: "The Mosque Connection",
    description: "Visit the Central Mosque to find an ally in the Imam",
    location: "Central Mosque",
    locationX: 350,
    locationY: 150,
    reward: 1500,
    completed: false,
    dialogue: [
      "Imam: 'Kwame Mensah. Your father was a brother to me.'",
      "Kwame: 'Imam, I need your help. The Cartel has taken everything.'",
      "Imam: 'I know things. Your father hid evidence against them. Financial records.'",
      "Imam: 'He trusted only a few people. Check the old storage near the mosque.'",
      "Kwame: 'Thank you, Imam. I won't let my father's sacrifice be in vain.'",
      "Imam: 'Be careful, my son. Power corrupts, even in the pursuit of justice.'"
    ],
    objective: "Find the Imam at the Central Mosque"
  },
  {
    id: 5,
    title: "Taking the Transport Hub",
    description: "Seize control of the Tamale Transport Terminal from the Cartel",
    location: "Transport Terminal",
    locationX: 700,
    locationY: 400,
    reward: 3000,
    completed: false,
    dialogue: [
      "Amina: 'The transport terminal is the Cartel's money maker. Every tro-tro that moves, they get a cut.'",
      "Kwame: 'Then we take it from them.'",
      "Amina: 'I've gathered some of your father's old workers. They're loyal.'",
      "Kwame: 'Good. Tonight, we make our move.'",
      "Cartel Boss: 'Mensah! You think you can take what's mine?'",
      "Kwame: 'It was always mine. You just borrowed it... with interest.'"
    ],
    objective: "Take control of the Transport Terminal"
  },
  {
    id: 6,
    title: "The Final Showdown",
    description: "Confront the Cartel leader at the Tamale Stadium",
    location: "Aliu Mahama Stadium",
    locationX: 500,
    locationY: 500,
    reward: 10000,
    completed: false,
    dialogue: [
      "Cartel Leader: 'So the little boy has grown into a man. Your father was foolish too.'",
      "Kwame: 'Where is my father?'",
      "Cartel Leader: 'Let's just say he's... retired. Permanently.'",
      "Kwame: 'Then you'll join him. This city is MINE.'",
      "Cartel Leader: 'You think killing me changes anything? There are others...'",
      "Kwame: 'Then I'll deal with them too. Tamale will be free.'",
      "--- END OF CHAPTER 1 ---",
      "Kwame has reclaimed his father's legacy. But the story is far from over...",
      "More territories await. More enemies lurk in the shadows.",
      "The Northern Region will know the name MENSAH once again."
    ],
    objective: "Defeat the Cartel Leader at the Stadium"
  }
];
