import { Button, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import { CONFIRMATION_TYPE, POST_TYPE } from 'constants/metadata';
import useCase from 'hooks/useCase';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';
import CasePostAddDialog from './CasePostAddDialog';

/**
 * A component with case confirmation posts.
 */
export default function CaseConfirmations({ caseObject, sx }) {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { isAccountHasCaseRole } = useCase();
  const [confirmationPosts, setConfirmationPosts] = useState(null);

  useEffect(() => {
    if (caseObject) {
      const confirmationPosts = caseObject.posts.filter(
        (post) => post.uriType === POST_TYPE.confirmation,
      );
      const sortedConfirmationPosts = confirmationPosts.sort((a, b) =>
        a?.createdDate?.localeCompare(b?.createdDate),
      );
      setConfirmationPosts(sortedConfirmationPosts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Box sx={{ ...sx }}>
      {/* Confirmations */}
      {confirmationPosts && confirmationPosts.length > 0 ? (
        <Stack spacing={1}>
          {confirmationPosts.map((post, index) => {
            const isConfirmed =
              hexStringToJson(post?.uriData)?.confirmationType ===
              CONFIRMATION_TYPE.confirmation;
            return (
              <Paper key={index} sx={{ p: 2 }}>
                {/* Author */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <ProfileCompactCard account={post.author} />
                </Stack>
                {/* Confirmation */}
                <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: isConfirmed ? 'success.main' : 'danger.main',
                    }}
                    gutterBottom
                  >
                    Witness {isConfirmed ? 'confirmed' : 'denied'} case
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold' }}
                    gutterBottom
                  >
                    {hexStringToJson(post.uriData)?.confirmationMessage}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(post.createdDate * 1000).toLocaleString()}
                  </Typography>
                </Paper>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Typography>None</Typography>
      )}
      {/* Add confirmation post form */}
      {caseObject?.stage === CASE_STAGE.open.id &&
        isAccountHasCaseRole(caseObject, account, CASE_ROLE.witness.id) && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                showDialog(
                  <CasePostAddDialog
                    caseObject={caseObject}
                    postType={POST_TYPE.confirmation}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              Add Confirmation
            </Button>
          </Box>
        )}
    </Box>
  );
}
