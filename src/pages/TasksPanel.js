import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ThemedProgressBar } from '../components/ThemeProvider';
import Separator from '../components/common/Separator';
import TaskFilters from '../components/TaskFilters';
import TaskGenerator from '../components/TaskGenerator';
import TaskTable from '../components/TaskTable';
import useBreakpoint, { MEDIA_QUERIES, MODE } from '../hooks/useBreakpoint';
import { PASSIVE_RELICS } from '../data/constants';
import useTrackerHistory from '../hooks/useTrackerHistory';

export default function TasksPanel({ readonly, taskState }) {
  const isSmViewport = useBreakpoint(MEDIA_QUERIES.SM, MODE.LESS_OR_EQ);
  const isXlViewport = useBreakpoint(MEDIA_QUERIES.XL);
  const [showSidebar, setShowSidebar] = useState(isXlViewport);
  const { taskStats, tier } = useSelector(state => state.tasks);
  const history = useTrackerHistory();

  return (
    <div className='h-full'>
      <div className='mb-3'>
        <div className='shadow-subdued mb-3'>
          <ThemedProgressBar
            curValue={taskStats.points.complete.total}
            maxValue={PASSIVE_RELICS.unlockThresholds[PASSIVE_RELICS.unlockThresholds.length - 1]}
            steps={PASSIVE_RELICS.unlockThresholds}
          />
        </div>
        <div className='flex flex-wrap text-accent font-semibold justify-evenly gap-2'>
          <span>
            Tasks: {taskStats.tasks.complete.total} / {taskStats.tasks.available.total}
          </span>
          <span>
            Points: {taskStats.points.complete.total} / {taskStats.points.available.total}
          </span>
          <span>
            Renown: {taskStats.renown.complete.total} / {taskStats.renown.available.total}
          </span>
          <span>
            To-do: {taskStats.tasks.todo.total} tasks ({taskStats.points.todo.total} points /{' '}
            {taskStats.renown.todo.total} renown)
          </span>
          {tier < PASSIVE_RELICS.unlockThresholds.length && (
            <span>{`Next unlock at ${PASSIVE_RELICS.tiers[tier + 1].points} pts (${
              PASSIVE_RELICS.tiers[tier + 1].points - taskStats.points.complete.total
            } remaining)`}</span>
          )}
        </div>
      </div>
      <Separator />
      <div className='flex xl:flex-row flex-col justify-around w-full bg-secondary-alt xl:bg-primary'>
        {isSmViewport && showSidebar && (
          <div className='mt-3 bg-hover cursor-pointer' onClick={() => setShowSidebar(!showSidebar)}>
            <span className='icon-xl align-middle'>keyboard_double_arrow_up</span>
            <span className='text-sm italic ml-1'>Hide filters</span>
          </div>
        )}
        {showSidebar && (
          <div className='basis-[23%] flex flex-col gap-3 pl-2'>
            <TaskFilters history={history} />
            <Separator />
            {!readonly && <TaskGenerator />}
          </div>
        )}
        <div className='mt-3 mb-3 bg-hover cursor-pointer' onClick={() => setShowSidebar(!showSidebar)}>
          {isXlViewport ? (
            <span className='icon-xl align-middle'>
              {showSidebar ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right'}
            </span>
          ) : (
            <>
              <span className='icon-xl align-middle'>
                {showSidebar ? 'keyboard_double_arrow_up' : 'keyboard_double_arrow_down'}
              </span>
              <span className='text-sm italic ml-1'>{showSidebar ? 'Hide filters' : 'Show filters'}</span>
            </>
          )}
        </div>
        <div className='basis-3/4 grow flex flex-col xl:ml-1 bg-primary'>
          <div className='border-t xl:border-l xl:border-t-0 pt-2 xl:pt-[0] border-subdued grow xl:mt-3'>
            <TaskTable history={history} readonly={readonly} taskState={taskState} />
          </div>
        </div>
      </div>
    </div>
  );
}
