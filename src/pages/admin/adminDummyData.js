// Dummy Data for Admin Dashboard

export const dummyRequests = [
    {
        id: 1,
        avNumber: 'AV1801',
        customerName: 'John Smith',
        email: 'john@example.com',
        phone: '0121 555 6666',
        serviceType: 'home',
        pickupPostcode: 'B5 7UJ',
        deliveryPostcode: 'E1 6AN',
        date: '2026-06-20',
        time: 'morning',
        items: ['Sofa (2-seater)', 'Bed Frame', 'Wardrobe'],
        totalVolume: '12.5 m³',
        specialInstructions: 'Please call 30 mins before arrival',
        submittedAt: '2026-06-17 14:32',
        status: 'pending'
    },
    {
        id: 2,
        avNumber: 'AV1802',
        customerName: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '0131 222 3333',
        serviceType: 'office',
        pickupPostcode: 'EH1 3AA',
        deliveryPostcode: 'G2 1BB',
        date: '2026-06-21',
        time: 'afternoon',
        items: ['Office Desk', 'Filing Cabinet', 'Shelving Unit', '15 Boxes'],
        totalVolume: '8.3 m³',
        specialInstructions: 'Fragile equipment inside',
        submittedAt: '2026-06-17 15:45',
        status: 'pending'
    },
];

export const dummyActiveJobs = [
    {
        id: 1,
        avNumber: 'AV1751',
        customerName: 'Michael Chen',
        email: 'michael@example.com',
        phone: '07700 900123',
        pickupAddr: '42 Kings Road, Birmingham B5 7UJ',
        deliveryAddr: '108 Old Street, London E1 6AN',
        date: '2026-06-18',
        time: 'morning',
        items: ['Sofa (3-seater)', 'Dining Table', 'Chairs (4)', 'Boxes (20)'],
        totalVolume: '15.2 m³',
        basePrice: 320,
        discount: 0,
        finalPrice: 320,
        driver: 'Ahmad Hassan',
        driverId: 1,
        status: 'active'
    },
    {
        id: 2,
        avNumber: 'AV1752',
        customerName: 'Emma Wilson',
        email: 'emma@example.com',
        phone: '07900 123456',
        pickupAddr: '15 Elm Street, Manchester M1 1AD',
        deliveryAddr: '25 High Street, Leeds LS1 6LS',
        date: '2026-06-18',
        time: 'afternoon',
        items: ['Bed Frame', 'Wardrobes (2)', 'Chest of Drawers'],
        totalVolume: '9.8 m³',
        basePrice: 280,
        discount: 20,
        finalPrice: 260,
        driver: 'Hassan Khan',
        driverId: 2,
        status: 'active'
    },
];

export const dummyOnWayJobs = [
    {
        id: 3,
        avNumber: 'AV1701',
        customerName: 'David Brown',
        email: 'david@example.com',
        phone: '0141 222 1111',
        pickupAddr: '50 George Street, Glasgow G2 1EH',
        deliveryAddr: '10 Princes Street, Edinburgh EH2 2AA',
        date: '2026-06-17',
        time: 'morning',
        items: ['Furniture Set', 'Boxes (30)'],
        totalVolume: '18.5 m³',
        basePrice: 400,
        discount: 0,
        finalPrice: 400,
        driver: 'Tariq Ahmed',
        driverId: 3,
        status: 'on-way',
        departedAt: '2026-06-17 09:30'
    },
];

export const dummyCompletedJobs = [
    {
        id: 4,
        avNumber: 'AV1601',
        customerName: 'Lisa Anderson',
        email: 'lisa@example.com',
        phone: '0113 200 1234',
        pickupAddr: '88 The Strand, Leeds LS1 6LS',
        deliveryAddr: '42 Piccadilly, Manchester M1 1PB',
        date: '2026-06-15',
        time: 'afternoon',
        items: ['Office Setup', 'Boxes (25)'],
        totalVolume: '14.2 m³',
        basePrice: 350,
        discount: 30,
        finalPrice: 320,
        driver: 'Ahmad Hassan',
        driverId: 1,
        status: 'completed',
        completedAt: '2026-06-15 18:45'
    },
];

export const dummyDrivers = [
    {
        id: 1,
        name: 'Ahmad Hassan',
        phone: '07700 111222',
        licenseNumber: 'AB12 CDE',
        bankDetails: 'Sort: 20-08-64 | Acc: 13519252',
        joiningDate: '2024-01-15',
        totalJobs: 145,
        earnings: 4850,
        assignedNow: 'AV1751'
    },
    {
        id: 2,
        name: 'Hassan Khan',
        phone: '07700 333444',
        licenseNumber: 'FG34 HIJ',
        bankDetails: 'Sort: 20-08-64 | Acc: 13519253',
        joiningDate: '2023-06-20',
        totalJobs: 212,
        earnings: 7120,
        assignedNow: 'AV1752'
    },
];

export const dummyExpenses = [
    {
        id: 1,
        date: '2026-06-17',
        type: 'fuel',
        description: 'Fuel - Van refill',
        amount: 65,
        driver: 'Ahmad Hassan'
    },
    {
        id: 2,
        date: '2026-06-17',
        type: 'miscellaneous',
        description: 'Driver lunch allowance',
        amount: 15,
        driver: 'Hassan Khan'
    },
    {
        id: 3,
        date: '2026-06-16',
        type: 'repair',
        description: 'Van tire replacement',
        amount: 180,
        driver: 'Tariq Ahmed'
    },
];
