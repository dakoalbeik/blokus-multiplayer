const blokusPieces = [
  { id: "p1", shape: [[1]] }, // Single square

  { id: "p2", shape: [[1, 1]] }, // Domino (2 squares)

  { id: "p3", shape: [[1, 1, 1]] }, // Straight 3
  {
    id: "p4",
    shape: [
      [1, 1],
      [1, 0],
    ],
  }, // L-shape 3

  { id: "p5", shape: [[1, 1, 1, 1]] }, // Straight 4
  {
    id: "p6",
    shape: [
      [1, 1, 1],
      [1, 0, 0],
    ],
  }, // L-shape 4
  {
    id: "p7",
    shape: [
      [1, 1],
      [1, 1],
    ],
  }, // Square 4

  { id: "p8", shape: [[1, 1, 1, 1, 1]] }, // Straight 5
  {
    id: "p9",
    shape: [
      [1, 1, 1, 1],
      [1, 0, 0, 0],
    ],
  }, // L-shape 5
  {
    id: "p10",
    shape: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
  }, // U-shape 5
  {
    id: "p11",
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
  }, // T-shape 5
  {
    id: "p12",
    shape: [
      [1, 1, 1],
      [0, 1, 1],
    ],
  }, // Z-shape 5
  {
    id: "p13",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
  }, // Cross 5
  {
    id: "p14",
    shape: [
      [1, 1],
      [0, 1],
      [1, 1],
    ],
  }, // W-shape 5
  {
    id: "p15",
    shape: [
      [1, 1, 1, 1],
      [0, 0, 1, 0],
    ],
  }, // Y-shape 5
  {
    id: "p16",
    shape: [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, 0],
    ],
  }, // Snake 5
  {
    id: "p17",
    shape: [
      [1, 1],
      [0, 1, 1],
    ],
  }, // Z-shape
  {
    id: "p18",
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [1, 0, 0],
    ],
  },
  {
    id: "p19",
    shape: [
      [0, 0, 1],
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  {
    id: "p20",
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  }, // Y-shape 5
  {
    id: "p21",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
  }, // + shape 5
];

export default blokusPieces;
