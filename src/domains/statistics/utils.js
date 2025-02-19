import { JACKPOT } from '../jackpot/constant.js';
import { getJackpotTargetRankInfo } from '../jackpot/utils.js';

export const getProfitRate = (initialAmount, finalAmount) => {
  const profitPercent = ((finalAmount - initialAmount) / initialAmount) * 100;

  return profitPercent % 1 === 0
    ? profitPercent
    : Math.floor(profitPercent * 10) / 10;
};

export const getStatisticsResult = (lottoResult) => {
  const rankNames = Object.keys(JACKPOT.RANKS);

  return rankNames.map((key) => {
    const rankInfo = getJackpotTargetRankInfo(
      JACKPOT.RANKS[key].number,
      lottoResult,
    );
    const { match, price } = JACKPOT.RULES[key];

    return {
      rank: key,
      matchCount: match[0],
      hasBonus: key === 'SECOND',
      price,
      count: rankInfo.count,
    };
  });
};
