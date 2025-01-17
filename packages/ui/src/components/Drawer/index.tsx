import React from 'react';
import BaseDrawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useDrawerState } from '@/stores/drawer';
import shallow from 'zustand/shallow';
import NetworkRequest from '@/components/NetworkRequest';
import { useDrawerWidth, useFilteredQueues, useSortedQueues } from './hooks';
import QueuesList from './Queues';
import QueuesFilter from './Filter';
import QueuesSorter from './Sorter';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useQueuesQuery } from '@/hooks/use-queues-query';
import isempty from 'lodash/isEmpty';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  drawer: {
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      flexShrink: 0,
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
  },
  filters: {
    display: 'flex',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    alignItems: 'center',
  },
  dragger: {
    width: 4,
    cursor: 'ew-resize',
    position: 'absolute',
    top: 0,
    right: -4,
    bottom: 0,
    zIndex: 1201,
  },
}));

export default function Drawer() {
  const { data, status, refetch, error } = useQueuesQuery();
  const cls = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isOpen, closeDrawer] = useDrawerState(
    (state) => [state.isOpen, state.close],
    shallow,
  );
  const queues = data?.queues;
  const filteredQueues = useFilteredQueues(queues);
  const sortedQueues = useSortedQueues(filteredQueues);
  const { drawerWidth, draggerRef } = useDrawerWidth();

  return (
    <nav
      className={cls.drawer}
      style={{ width: isDesktop ? drawerWidth : 'auto' }}
    >
      <div ref={draggerRef} className={cls.dragger} />
      <BaseDrawer
        open={isDesktop || isOpen}
        container={isDesktop ? undefined : window.document.body}
        variant={isDesktop ? 'permanent' : 'temporary'}
        onClose={closeDrawer}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        PaperProps={{ style: { width: drawerWidth } }}
      >
        <div className={cls.toolbar}>
          <IconButton onClick={closeDrawer}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <NetworkRequest error={error} status={status} refetch={refetch}>
          {isempty(queues) ? (
            <Alert severity="error">No queues</Alert>
          ) : (
            <>
              <div className={cls.filters}>
                <QueuesFilter />
                <QueuesSorter />
              </div>
              {sortedQueues && <QueuesList queues={sortedQueues} />}
            </>
          )}
        </NetworkRequest>
      </BaseDrawer>
    </nav>
  );
}
