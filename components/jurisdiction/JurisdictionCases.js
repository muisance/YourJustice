import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CaseList from 'components/case/CaseList';
import useCase from 'hooks/useCase';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction cases.
 */
export default function JurisdictionCases() {
  const { showToastError } = useToasts();
  const { getCases } = useCase();
  const [cases, setCases] = useState(null);

  async function loadCases() {
    try {
      setCases(
        await getCases(process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS),
      );
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box>
        <Typography variant="h1" gutterBottom>
          Cases
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 3 }}>
        <CaseList cases={cases} />
      </Box>
    </>
  );
}
