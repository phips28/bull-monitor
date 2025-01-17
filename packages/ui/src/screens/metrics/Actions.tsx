import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useAtomValue } from 'jotai/utils';
import { activeQueueAtom } from '@/atoms/workspaces';
import { useAbstractMutation } from '@/hooks/use-abstract-mutation';
import { useNetwork } from '@/hooks/use-network';
import { useQueryClient } from 'react-query';
import { QueryKeysConfig } from '@/config/query-keys';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const MetricsActions = () => {
  const {
    mutations: { clearMetrics, clearAllMetrics },
  } = useNetwork();
  const queryClient = useQueryClient();
  const queue = useAtomValue(activeQueueAtom) as string;
  const clearMetricsMutation = useAbstractMutation({
    mutation: clearMetrics,
    toast: 'Cleared',
    confirm: {
      description: 'Clear metrics',
    },
    onSuccess() {
      queryClient.invalidateQueries(QueryKeysConfig.metrics);
    },
  });
  const clearAllMetricsMutation = useAbstractMutation({
    mutation: clearAllMetrics,
    toast: 'Cleared',
    confirm: {
      description: 'Clear all metrics',
    },
    onSuccess() {
      queryClient.invalidateQueries(QueryKeysConfig.metrics);
    },
  });
  const cls = useStyles();
  return (
    <Paper className={cls.root}>
      <Button
        onClick={() => clearMetricsMutation.mutate({ queue })}
        color="secondary"
      >
        Clear
      </Button>
      <Button
        onClick={() => clearAllMetricsMutation.mutate(null)}
        color="secondary"
      >
        Clear all
      </Button>
    </Paper>
  );
};

export default MetricsActions;
