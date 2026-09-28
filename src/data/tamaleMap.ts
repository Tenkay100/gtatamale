export interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'building' | 'landmark' | 'road' | 'market' | 'safehouse';
  color: string;
  description: string;
}

export interface Road {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  name: string;
}

export const MAP_WIDTH = 900;
export const MAP_HEIGHT = 650;

export const locations: MapLocation[] = [
  // Central Market Area
  {
    id: 'central_market',
    name: 'Tamale Central Market',
    x: 400,
    y: 250,
    width: 100,
    height: 70,
    type: 'market',
    color: '#ff6b35',
    description: 'The bustling heart of Tamale commerce'
  },
  // Central Mosque
  {
    id: 'central_mosque',
    name: 'Central Mosque',
    x: 320,
    y: 120,
    width: 60,
    height: 60,
    type: 'landmark',
    color: '#4ecdc4',
    description: 'The iconic Larabanga-style mosque'
  },
  // Teaching Hospital
  {
    id: 'teaching_hospital',
    name: 'Tamale Teaching Hospital',
    x: 620,
    y: 150,
    width: 80,
    height: 60,
    type: 'building',
    color: '#ff4757',
    description: 'The major hospital in the Northern Region'
  },
  // Transport Terminal
  {
    id: 'transport_terminal',
    name: 'Transport Terminal',
    x: 670,
    y: 380,
    width: 90,
    height: 60,
    type: 'building',
    color: '#ffa502',
    description: 'Main tro-tro station connecting all routes'
  },
  // Aliu Mahama Stadium
  {
    id: 'stadium',
    name: 'Aliu Mahama Stadium',
    x: 460,
    y: 470,
    width: 100,
    height: 80,
    type: 'landmark',
    color: '#2ed573',
    description: 'Home of Real Tamale United'
  },
  // Tamale New Town (Safehouse)
  {
    id: 'new_town',
    name: 'Tamale New Town',
    x: 160,
    y: 320,
    width: 80,
    height: 70,
    type: 'safehouse',
    color: '#a29bfe',
    description: 'Your old neighborhood - your safehouse'
  },
  // UDS University
  {
    id: 'uds',
    name: 'University for Dev. Studies',
    x: 150,
    y: 130,
    width: 90,
    height: 60,
    type: 'building',
    color: '#74b9ff',
    description: 'UDS Campus - hub of knowledge'
  },
  // Northern Regional Hospital
  {
    id: 'regional_hospital',
    name: 'Regional Hospital',
    x: 750,
    y: 250,
    width: 70,
    height: 50,
    type: 'building',
    color: '#ff6b81',
    description: 'Old hospital near the city center'
  },
  // Kalpohin Estate
  {
    id: 'kalpohin',
    name: 'Kalpohin Estate',
    x: 100,
    y: 470,
    width: 80,
    height: 60,
    type: 'building',
    color: '#dfe6e9',
    description: 'Residential area'
  },
  // Tamale Stadium Area
  {
    id: 'stadium_area',
    name: 'Stadium Area',
    x: 550,
    y: 530,
    width: 70,
    height: 50,
    type: 'building',
    color: '#b2bec3',
    description: 'Commercial area near the stadium'
  },
  // Dagbon Palace
  {
    id: 'dagbon_palace',
    name: 'Dagbon Palace',
    x: 300,
    y: 400,
    width: 70,
    height: 60,
    type: 'landmark',
    color: '#fdcb6e',
    description: 'Seat of the Ya-Naa'
  },
  // Police Station
  {
    id: 'police',
    name: 'Police Station',
    x: 500,
    y: 100,
    width: 60,
    height: 50,
    type: 'building',
    color: '#636e72',
    description: 'Ghana Police Service - Tamale Division'
  },
  // Lorry Park
  {
    id: 'lorry_park',
    name: 'Lorry Park',
    x: 780,
    y: 450,
    width: 70,
    height: 50,
    type: 'building',
    color: '#e17055',
    description: 'Main lorry station for long routes'
  },
  // A&C Mall Area
  {
    id: 'mall',
    name: 'Mall Area',
    x: 400,
    y: 50,
    width: 60,
    height: 40,
    type: 'building',
    color: '#00cec9',
    description: 'Modern shopping center'
  },
  // Residences
  {
    id: 'residential_1',
    name: 'Gbugli',
    x: 50,
    y: 200,
    width: 60,
    height: 50,
    type: 'building',
    color: '#dfe6e9',
    description: 'Residential neighborhood'
  },
  {
    id: 'residential_2',
    name: 'Tudu',
    x: 250,
    y: 550,
    width: 70,
    height: 50,
    type: 'building',
    color: '#b2bec3',
    description: 'Traditional neighborhood'
  },
];

export const roads: Road[] = [
  // Main horizontal roads
  { x1: 0, y1: 200, x2: 900, y2: 200, width: 8, name: 'Independence Road' },
  { x1: 0, y1: 350, x2: 900, y2: 350, width: 8, name: 'Market Circle Road' },
  { x1: 0, y1: 500, x2: 900, y2: 500, width: 6, name: 'Stadium Road' },
  // Main vertical roads
  { x1: 200, y1: 0, x2: 200, y2: 650, width: 8, name: 'Hospital Road' },
  { x1: 450, y1: 0, x2: 450, y2: 650, width: 8, name: 'Central Road' },
  { x1: 700, y1: 0, x2: 700, y2: 650, width: 6, name: 'Eastern Bypass' },
  // Connecting roads
  { x1: 100, y1: 100, x2: 800, y2: 100, width: 5, name: 'University Road' },
  { x1: 350, y1: 100, x2: 350, y2: 600, width: 5, name: 'Mosque Road' },
  { x1: 600, y1: 150, x2: 600, y2: 550, width: 5, name: 'East Avenue' },
];
