import { Grid, Typography } from '@mui/material';
import LoadingBackdrop from 'components/extra/LoadingBackdrop';
import { DEFAULT_ADD_REPUTATION_AMOUNT, REPUTATION_DOMAIN_ID, REPUTATION_RATING_ID } from "constants/contracts";
import useAvatarNftContract from 'hooks/useAvatarNftContract';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ProfileCard from './ProfileCard';

/**
 * A component with a list of profiles.
 */
export default function ProfileList({ profiles, onUpdateProfiles }) {

  const { enqueueSnackbar } = useSnackbar();
  const { addReputation } = useAvatarNftContract();
  const [isLoading, setIsLoading] = useState(false);
  const defaultProfiles = [{}, {}, {}];

  /**
   * Add positive or negative reputation to the environment domain for specified profile.
   */
  async function addScore(profile, isNegative) {
    try {
      setIsLoading(true);
      const transaction = await addReputation(
        profile.avatarNftId,
        REPUTATION_DOMAIN_ID.environment,
        isNegative ? REPUTATION_RATING_ID.negative : REPUTATION_RATING_ID.positive,
        DEFAULT_ADD_REPUTATION_AMOUNT
      );
      await transaction.wait();
      enqueueSnackbar("Success!", { variant: 'success' });
      onUpdateProfiles();
    }
    catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Grid container spacing={2}>
      {isLoading && <LoadingBackdrop />}
      {!profiles && (
        <>
          {[{}, {}, {}].map((_, index) =>
            <Grid key={index} item xs={12} md={4}>
              <ProfileCard />
            </Grid>
          )}
        </>
      )}
      {profiles && profiles.length > 0 && (
        <>
          {(profiles).map((profile, index) =>
            profile && (
              <Grid key={index} item xs={12} md={4}>
                <ProfileCard
                  profile={profile}
                  onAddNegativeScore={(profile) => addScore(profile, true)}
                  onAddPositiveScore={(profile) => addScore(profile, false)}
                />
              </Grid>
            )
          )}
        </>
      )}
      {(!profiles || profiles.length === 0) && (
        <Grid item xs={12} md={4}>
          <Typography>None</Typography>
        </Grid>
      )}
    </Grid>
  )
}