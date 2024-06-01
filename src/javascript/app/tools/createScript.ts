import dayjs from 'dayjs';
import type { Contribution } from '../stores/mainStore';

const repeats = [0, 4, 3, 2, 1];

export const createScript = (contributions: Contribution[]): string => {
  const script = [];

  script.push('#!/bin/sh');
  // script.push('cd wherever');
  // script.push('rm -rf ./test');
  script.push('mkdir test');
  script.push('cd test');
  script.push('git init');

  contributions.forEach((contribution, index) => {
    for (let i = 0; i < repeats[contribution.level]; i += 1) {
      const day = dayjs(contribution.date).set('minutes', i);
      script.push(`echo "${index},${i + 1}" > file.txt`);
      script.push('git add .');
      script.push(`git commit -m "${contribution.date} - ${i + 1}" --date "${day.toString()}"`);

      if (index === 0 && i === 0) {
        script.push('git branch -m pixels');
      }
    }
  });

  script.push('git status');

  return script.join('\n');
};
