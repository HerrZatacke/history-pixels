import React from 'react';
import { saveAs } from 'file-saver';
import type { MouseEvent } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import type { Contribution } from '../../stores/mainStore';
import useMainStore from '../../stores/mainStore';

import './index.scss';
import { createScript } from '../../tools/createScript';


const YEARS = 20;

dayjs.extend(isLeapYear);

function App() {
  const { contributions, year, setYear, setContribution, clearYear } = useMainStore();

  const startYear = dayjs().subtract(YEARS - 1, 'years').get('year');
  const years = Array(YEARS).fill('').map((_, index) => (startYear + index).toString(10));

  const thisYear = dayjs(`${year}-01-01T12:00:00.000Z`);

  const fillers = Array(thisYear.day())
    .fill('')
    .map((_, index) => (<div key={index} className="app__day app__day--filler" />));

  const days = Array(thisYear.isLeapYear() ? 366 : 365).fill('').map((_, index) => {
    const day = thisYear.add(index, 'days');
    const contribution = contributions.find(({ date }) => date === day.toString());

    return {
      day,
      contribution,
    };
  });

  const updateContributions = (ev: MouseEvent<HTMLButtonElement>, day: Dayjs, contribution?: Contribution) => {
    let nextLevel: number;
    if (ev.ctrlKey) {
      nextLevel = 0;
    } else {
      const level = contribution?.level || 0;
      nextLevel = level === 0 ? 4 : level - 1;
    }

    setContribution(day.toString(), nextLevel);
  };

  const doIt = async () => {
    const yearContributions = contributions.filter((contribution) => dayjs(contribution.date).year() === year);

    const result = createScript(yearContributions);

    const blob = new Blob([result], {
      type: 'text/plain',
    });

    saveAs(blob, 'script.sh');
  };

  return (
    <div className="app">
      <select
        value={year}
        onChange={(ev) => setYear(parseInt(ev.target.value, 10))}
      >
        { years.map((yearOption) => (
          <option key={yearOption} value={yearOption}>{yearOption}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => clearYear(year)}
      >
        {`Clear ${year}`}
      </button>
      <button
        type="button"
        onClick={doIt}
      >
        Do it
      </button>
      <div className="app__year-table">
        { fillers }
        {
          days.map(({ day, contribution }, index) => (
            <button
              key={index}
              type="button"
              title={day.format('DD MMMM YYYY')}
              className={`app__day ${contribution?.level ? `app__day--l${contribution.level}` : ''}`}
              onClick={(ev) => updateContributions(ev, day, contribution)}
            />
          ))
        }
      </div>
    </div>
  );
}

export default App;
