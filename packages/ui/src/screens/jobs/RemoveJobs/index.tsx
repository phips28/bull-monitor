import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import shallow from 'zustand/shallow';
import { useNetwork } from '@/hooks/use-network';
import { useAbstractMutation } from '@/hooks/use-abstract-mutation';
import TextField from '@material-ui/core/TextField';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRemoveJobsModalStore } from '@/stores/remove-jobs-modal';
import { activeQueueAtom } from '@/atoms/workspaces';
import { useAtomValue } from 'jotai/utils';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: 500,
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  form: {
    width: '100%',
  },
}));

const RemoveJobs = () => {
  const [pattern, setPattern] = React.useState('');
  const classes = useStyles();
  const queue = useAtomValue(activeQueueAtom) as string;

  const {
    mutations: { removeJobsByPattern },
  } = useNetwork();
  const onClose = useRemoveJobsModalStore((state) => state.close);
  const mutation = useAbstractMutation({
    mutation: removeJobsByPattern,
    invalidateSharedQueries: true,
    toast: 'Jobs have been removed',
    onSuccess: onClose,
  });
  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    mutation.mutate({
      queue,
      pattern,
    });
  };
  return (
    <>
      <DialogContent className={classes.container}>
        <form
          onSubmit={onSubmit}
          id="remove-jobs_form"
          className={classes.form}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            id="remove-jobs_pattern"
            label="Pattern"
            required
            className={classes.formControl}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={mutation.isLoading}
          type="submit"
          form="remove-jobs_form"
        >
          Submit
        </Button>
      </DialogActions>
    </>
  );
};
export default function RemoveJobsModal() {
  const [isOpen, onClose] = useRemoveJobsModalStore(
    (state) => [state.isOpen, state.close],
    shallow,
  );
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <RemoveJobs />
    </Dialog>
  );
}
