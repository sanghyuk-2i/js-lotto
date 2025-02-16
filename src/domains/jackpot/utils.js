import { isArrayDifference } from '../../utils/index.js';
import { LOTTO } from '../common/constants.js';
import { isLottoNumberRange } from '../common/utils.js';
import { JACKPOT, JACKPOT_RANKS } from './constant.js';

const isIncludeBonusNumber = (orderedNumbers, bonusNumber) =>
  orderedNumbers.includes(bonusNumber);

const matchJackpotNumbers = (orderedNumbers, jackpotNumbers) => {
  return orderedNumbers.filter((value) => jackpotNumbers.includes(value));
};

const getJackpotRank = (matchedNumbers, isBonus) => {
  const match = [matchedNumbers.length, isBonus ? 1 : 0];

  return (() => {
    if (isArrayDifference(match, JACKPOT.RULES.FIRST.match))
      return JACKPOT_RANKS.FIRST.number;
    if (isArrayDifference(match, JACKPOT.RULES.SECOND.match))
      return JACKPOT_RANKS.SECOND.number;
    if (isArrayDifference(match, JACKPOT.RULES.THIRD.match))
      return JACKPOT_RANKS.THIRD.number;
    if (isArrayDifference(match, JACKPOT.RULES.FOURTH.match))
      return JACKPOT_RANKS.FOURTH.number;
    if (isArrayDifference(match, JACKPOT.RULES.FIFTH.match))
      return JACKPOT_RANKS.FIFTH.number;
    return 0;
  })();
};

export const isValidJackpotNumbersInput = (numbers) => {
  return (
    Array.isArray(numbers) &&
    numbers.length === LOTTO.SIZE &&
    numbers.every((value) => isLottoNumberRange(value))
  );
};

export const getJackpotPrice = (rank) => {
  return (
    {
      [JACKPOT.RANKS.FIRST.number]: JACKPOT.RULES.FIRST.price,
      [JACKPOT.RANKS.SECOND.number]: JACKPOT.RULES.SECOND.price,
      [JACKPOT.RANKS.THIRD.number]: JACKPOT.RULES.THIRD.price,
      [JACKPOT.RANKS.FOURTH.number]: JACKPOT.RULES.FOURTH.price,
      [JACKPOT.RANKS.FIFTH.number]: JACKPOT.RULES.FIFTH.price,
    }[rank] ?? 0
  );
};

export const getJackpotTargetRankInfo = (targetRank, lottoResult) => {
  return lottoResult.reduce(
    (results, { rank, price }) =>
      rank === targetRank
        ? { count: results.count + 1, amount: results.amount + price }
        : results,
    { count: 0, amount: 0 },
  );
};

export const getJackpotTotalAmount = (lottoResult) => {
  return lottoResult.reduce((total, { price }) => (total += price), 0);
};

export const getJackpotResult = (lotto, bonusNumber) => {
  const { ordered, jackpot } = lotto;

  const hasBonusNumber = isIncludeBonusNumber(ordered, bonusNumber);
  const matchedNumbers = matchJackpotNumbers(ordered, jackpot);

  const matchedCount = matchedNumbers.length;
  const rank = getJackpotRank(matchedNumbers, hasBonusNumber);
  const price = getJackpotPrice(rank);
  const isJackpot = matchJackpotNumbers.length >= JACKPOT.MIN_MATCH;

  return { isJackpot, rank, price, matchedCount };
};
