import {InfuraProvider} from '@ethersproject/providers';
import { assert } from 'chai';
import { ethers } from 'ethers';
import { Contract, Provider } from '../src';

const provider = new InfuraProvider('mainnet');
const ethcallProvider = new Provider(provider, 1);

it('human readable abi', async () => {
  const abi = ['function totalSupply() public view returns (uint256)'];
  const addresses = [
    '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
  ];

  const yfiContract = new Contract(addresses[0], abi);
  const uniContract = new Contract(addresses[1], abi);

  const calls = [yfiContract.totalSupply(), uniContract.totalSupply()];
  const [yfiSupply, uniSupply] = await ethcallProvider.all(calls);

  assert.equal(yfiSupply.toString(), '36666000000000000000000');
  assert.equal(uniSupply.toString(), '1000000000000000000000000000');
});

it('json abi', async () => {
  const abi = [
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
  ];
  const addresses = [
    '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
  ];

  const yfiContract = new Contract(addresses[0], abi);
  const uniContract = new Contract(addresses[1], abi);

  const calls = [yfiContract.totalSupply(), uniContract.totalSupply()];
  const [yfiSupply, uniSupply] = await ethcallProvider.all(calls);

  assert.equal(yfiSupply.toString(), '36666000000000000000000');
  assert.equal(uniSupply.toString(), '1000000000000000000000000000');
});

it('historic data', async () => {
  const abi = ['function totalSupply() public view returns (uint256)'];
  const crvAddress = '0xD533a949740bb3306d119CC777fa900bA034cd52';
  const crv = new Contract(crvAddress, abi);
  const testCases = [
    { blockTag: 10647806, supply: '1303030303000000000000000000' },
    { blockTag: 16000000, supply: '1854794513416445185592748811' },
  ];
  for (const testCase of testCases) {
    const { blockTag, supply } = testCase;
    const actualSupply = (await ethcallProvider.all([crv.totalSupply()], {blockTag}))[0];
    assert.equal(actualSupply, supply);
  }
});
