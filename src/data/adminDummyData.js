export const dummyRequests = [
  {
    id: 1,
    customerName: 'John Smith',
    avNumber: 'AV1801',
    email: 'john@example.com',
    phone: '0121 555 6666',
    route: { pickup: 'B5 7UJ', delivery: 'E1 6AN' },
    date: '2026-06-20',
    time: 'morning',
    items: ['Sofa (2-seater)', 'Bed Frame', 'Wardrobe'],
    volume: '12.5 m³',
    specialInstructions: 'Please call 30 mins before arrival',
    status: 'PENDING'
  },
  {
    id: 2,
    customerName: 'Sarah Johnson',
    avNumber: 'AV1802',
    email: 'sarah@example.com',
    phone: '0121 555 7777',
    route: { pickup: 'M1 1AB', delivery: 'S1 2BJ' },
    date: '2026-06-21',
    time: 'afternoon',
    items: ['3-Seater Sofa', 'Dining Table', 'Chairs (Set of 4)'],
    volume: '15 m³',
    specialInstructions: 'Ground floor access only',
    status: 'PENDING'
  }
];

export const dummyActiveJobs = [
  {
    id: 1,
    avNumber: 'AV1751',
    customerName: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+44 7700 900123',
    pickupAddr: '42 Park Lane, London, SW19 5NQ',
    deliveryAddr: 'Flat 5, Regent Street, Manchester, M1 1AB',
    driver: 'Ahmad Hassan',
    vehicle: 'Not Assigned',
    finalPrice: 320,
    discount: 0,
    status: 'active',
    date: '2026-06-19',
    time: '9:00 AM - 5:00 PM',
    pickupFloor: 'Ground floor',
    deliveryFloor: 'Ground floor',
    items: [
      { name: '2-Seater Sofa', volume: 3500 },
      { name: 'Coffee Table', volume: 600 },
      { name: 'TV Stand', volume: 800 },
      { name: 'Armchair', volume: 2000 }
    ],
    specialInstructions: 'Please handle with care, items are valuable',
    volume: '7.0 m³'
  },
  {
    id: 2,
    avNumber: 'AV1752',
    customerName: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+44 7700 900124',
    pickupAddr: '18 Maple Road, Edinburgh, EH10 5DS',
    deliveryAddr: '32 Rose Avenue, Glasgow, G2 1BD',
    driver: 'Hassan Khan',
    vehicle: 'Not Assigned',
    finalPrice: 260,
    discount: 20,
    status: 'active',
    date: '2026-06-19',
    time: '10:00 AM - 6:00 PM',
    pickupFloor: '1st floor',
    deliveryFloor: 'Ground floor',
    items: [
      { name: 'Single Bed Frame', volume: 2000 },
      { name: 'Mattress (Single)', volume: 1500 },
      { name: 'Wardrobe/Dresser', volume: 2000 },
      { name: 'Bedside Table', volume: 400 }
    ],
    specialInstructions: 'Access via back entrance',
    volume: '5.9 m³'
  }
];

export const dummyOnWayJobs = [
  {
    id: 3,
    avNumber: 'AV1701',
    customerName: 'David Brown',
    email: 'david@example.com',
    phone: '+44 7700 900125',
    pickupAddr: '67 Oak Street, Birmingham, B1 1AA',
    deliveryAddr: '12 Elm Road, Coventry, CV1 2EE',
    driver: 'Ahmad Hassan',
    vehicle: 'Van A1',
    finalPrice: 400,
    discount: 0,
    status: 'on-way',
    date: '2026-06-18',
    time: '2:00 PM - 8:00 PM',
    pickupFloor: '2nd floor',
    deliveryFloor: '1st floor',
    items: [
      { name: 'Corner Sofa', volume: 5500 },
      { name: 'Dining Table', volume: 2000 },
      { name: 'Cabinet', volume: 1200 }
    ],
    specialInstructions: 'Lift available at destination',
    volume: '8.7 m³'
  }
];

export const dummyCompletedJobs = [
  {
    id: 4,
    avNumber: 'AV1601',
    customerName: 'Lisa Anderson',
    email: 'lisa@example.com',
    phone: '+44 7700 900126',
    pickupAddr: '25 Cedar Lane, Bristol, BS5 6DG',
    deliveryAddr: '9 Birch Road, Plymouth, PL1 1AE',
    driver: 'Hassan Khan',
    vehicle: 'Van B2',
    finalPrice: 320,
    discount: 0,
    status: 'completed',
    date: '2026-06-17',
    time: '8:00 AM - 4:00 PM',
    pickupFloor: 'Ground floor',
    deliveryFloor: 'Ground floor',
    items: [
      { name: 'Office Desk', volume: 2000 },
      { name: 'Office Chair', volume: 800 },
      { name: 'Filing Cabinet', volume: 1200 },
      { name: 'Bookshelf', volume: 1500 }
    ],
    specialInstructions: 'None',
    volume: '5.5 m³'
  }
];

export const dummyDrivers = [
  {
    id: 1,
    name: 'Ahmad Hassan',
    phone: '+44 7700 100001',
    joinDate: '2024-01-15',
    license: 'LGV (Large Goods Vehicle)',
    bankDetails: { sort: '20-08-64', acc: '13519252', name: 'Ahmad Hassan' },
    totalJobs: 156,
    earnings: '£4,680',
    currentJob: 'AV1701 (On-Way)',
    stats: { totalJobs: 156, earnings: 4680, rating: 4.9 }
  },
  {
    id: 2,
    name: 'Hassan Khan',
    phone: '+44 7700 100002',
    joinDate: '2024-03-22',
    license: 'LGV (Large Goods Vehicle)',
    bankDetails: { sort: '20-08-64', acc: '13519253', name: 'Hassan Khan' },
    totalJobs: 142,
    earnings: '£4,260',
    currentJob: 'None',
    stats: { totalJobs: 142, earnings: 4260, rating: 4.8 }
  }
];

export const dummyExpenses = [
  {
    id: 1,
    type: 'fuel',
    description: 'Fuel - Van A1',
    amount: 65,
    driver: 'Ahmad Hassan',
    date: '2026-06-18'
  },
  {
    id: 2,
    type: 'misc',
    description: 'Equipment maintenance',
    amount: 15,
    driver: 'Hassan Khan',
    date: '2026-06-17'
  },
  {
    id: 3,
    type: 'repair',
    description: 'Van B2 tire replacement',
    amount: 180,
    driver: 'Hassan Khan',
    date: '2026-06-16'
  }
];
