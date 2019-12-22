const data = require('./day-8-data');

const WIDTH = 25;
const HEIGHT = 6;
const LAYER_SIZE = WIDTH * HEIGHT;

const BLACK = 0;
const WHITE = 1;
const TRANS = 2;

const getLayers = data => {
  const layers = [];

  for (let i = 0; i < data.length; i += LAYER_SIZE) {
    const layer = data.slice(i, i + LAYER_SIZE).split('');
    layers.push(layer);
  }
  return layers;
}

const getLayerWithFewestZeros = layers => {
  let fewestZeros = LAYER_SIZE;
  return layers.reduce((fewestIndex, layer, index) => {
    const layerZeros = layer.filter(num => num === '0').length
    if (layerZeros < fewestZeros) {
      fewestZeros = layerZeros;
      return index;
    }
    return fewestIndex;
  }, 0);
};

const getOnesByTwos = layer => {
  const ones = layer.filter(num => num === '1').length;
  const twos = layer.filter(num => num === '2').length;
  return ones * twos;
}

it('gets all layers', () => {
  expect(getLayers(data).length).toBe(data.length / WIDTH / HEIGHT);
});

it('finds layer with fewest zeros', () => {
  const layers = getLayers(data);
  expect(getLayerWithFewestZeros(layers)).toBe(15);
});

it('finds ones multiplied by twos', () => {
  const fakeLayer = '1111222'.split('');
  expect(getOnesByTwos(fakeLayer)).toBe(12);
  const layers = getLayers(data);
  const fewestIndex = getLayerWithFewestZeros(layers);
  const onesByTwos = getOnesByTwos(layers[fewestIndex]);
  expect(onesByTwos).toBe(2440);
});

const getPattern = (str, layerSize = LAYER_SIZE) => {
  // 25 Width, 6 height, 100 layers means we need to jump by 100
  // starting at the first position. When we reach the last position,
  // record final transparency.
  const finalLayer = Array(layerSize).fill('');

  for (let i = 0; i < layerSize; i++) {
    for (let j = i; j < str.length; j += layerSize) {
      if (finalLayer[i]) break;

      if (str[j] !== '2') {
        // console.log('str[j]', str[j])
        finalLayer[i] = str[j];
      }
    }
  }
  return finalLayer;
}

const makeRows = () => {};

it('gets simple pattern', () => {
  const actual = getPattern('2222 1202 0011 0000'.replace(/ /g, ''), 4);
  expect(actual).toEqual(['1', '0', '0', '1']);
});


