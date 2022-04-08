import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
  InsertPhotoOutlined,
  Save,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import {
  DEFAULT_ADD_REPUTATION_AMOUNT,
  REPUTATION_DOMAIN_ID,
  REPUTATION_RATING_ID,
} from 'constants/contracts';
import useAvatarNftContract from 'hooks/contracts/useAvatarNftContract';
import useToasts from 'hooks/useToasts';
import NextLink from 'next/link';
import { useState } from 'react';
import { formatAccount } from 'utils/formatters';
import { getTraitValue, traitTypes } from 'utils/metadata';
import { getRating } from 'utils/reputation';

/**
 * A component with a card with profile.
 */
export default function ProfileCard({ profile }) {
  const { showToastSuccess, showToastError } = useToasts();
  const { addReputation } = useAvatarNftContract();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Add positive or negative reputation (score) to the environment domain for specified profile.
   */
  async function addScore(isNegative) {
    try {
      setIsProcessing(true);
      await addReputation(
        profile.avatarNftId,
        REPUTATION_DOMAIN_ID.environment,
        isNegative
          ? REPUTATION_RATING_ID.negative
          : REPUTATION_RATING_ID.positive,
        DEFAULT_ADD_REPUTATION_AMOUNT,
      );
      showToastSuccess(
        'Success! Reputation of this profile will be updated soon.',
      );
    } catch (error) {
      showToastError(error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Card elevation={1}>
      {profile?.account ? (
        <CardContent sx={{ p: '10px !important' }}>
          {/* Image and details */}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            {/* Image */}
            <Box sx={{ mr: 2 }}>
              <Avatar
                sx={{ width: 82, height: 82, borderRadius: '16px' }}
                src={profile.avatarNftMetadata?.image}
              >
                <InsertPhotoOutlined />
              </Avatar>
            </Box>
            {/* Details */}
            <Box sx={{ flex: '1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography sx={{ mr: 1 }}>Case:</Typography>
                <Typography sx={{ color: 'success.main', mr: 1 }}>
                  +
                  {getRating(
                    profile,
                    REPUTATION_DOMAIN_ID.environment,
                    REPUTATION_RATING_ID.positive,
                  )}
                </Typography>
                <Typography sx={{ color: 'danger.main', mr: 1 }}>
                  -
                  {getRating(
                    profile,
                    REPUTATION_DOMAIN_ID.environment,
                    REPUTATION_RATING_ID.negative,
                  )}
                </Typography>
              </Box>
              <NextLink href={`/profile/${profile.account}`} passHref>
                <Link variant="h5" sx={{ mb: 2 }} underline="none">
                  {getTraitValue(
                    profile.avatarNftMetadata,
                    traitTypes.firstName,
                  ) || 'None'}{' '}
                  {getTraitValue(
                    profile.avatarNftMetadata,
                    traitTypes.lastName,
                  ) || 'None'}
                </Link>
              </NextLink>
              <Box>
                <Typography>{formatAccount(profile.account)}</Typography>
              </Box>
            </Box>

            {/* Actions */}
            <Stack
              direction="column"
              spacing={1}
              justifyContent="center"
              sx={{ mr: '10px !important' }}
            >
              {isProcessing ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  startIcon={<Save />}
                  variant="outlined"
                >
                  Processing
                </LoadingButton>
              ) : (
                <>
                  <Button
                    variant="text"
                    color="success"
                    size="small"
                    startIcon={<AddBoxOutlined />}
                    onClick={() => addScore(false)}
                  >
                    Add Score
                  </Button>
                  <Button
                    variant="text"
                    color="danger"
                    size="small"
                    startIcon={<IndeterminateCheckBoxOutlined />}
                    onClick={() => addScore(true)}
                  >
                    Add Score
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </CardContent>
      ) : (
        <CardContent>
          <Skeleton variant="circular" sx={{ mb: 2 }} width={82} height={82} />
          <Skeleton variant="rectangular" height={64} />
        </CardContent>
      )
      }
    </Card >
  );
}
