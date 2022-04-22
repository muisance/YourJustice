import { Box, Pagination } from '@mui/material';
import CaseList from 'components/case/CaseList';
import CaseStageSelect from 'components/form/widget/CaseStageSelect';
import ProfileSelect from 'components/form/widget/ProfileSelect';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCount, setCurrentPageCount] = useState(1);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedParticipantAccount, setSelectedParticipantAccount] =
    useState(null);
  const pageSize = 5;

  async function loadData(page = currentPage, pageCount = currentPageCount) {
    try {
      // Update states
      setCurrentPage(page);
      setCurrentPageCount(pageCount);
      setCases(null);
      // Load cases for page
      const cases = await getCases(
        process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
        selectedStage,
        selectedParticipantAccount,
        pageSize,
        (page - 1) * pageSize,
      );
      setCases(cases);
      // Add next page to pagination if possible
      if (page == pageCount && cases.length === pageSize) {
        setCurrentPageCount(pageCount + 1);
      }
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData(1, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParticipantAccount, selectedStage]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ProfileSelect
          size="small"
          sx={{ flexGrow: 4 }}
          onChange={(account) => setSelectedParticipantAccount(account)}
        />
        <CaseStageSelect
          size="small"
          sx={{ flexGrow: 1, ml: 1 }}
          onChange={(stage) =>
            stage !== '' ? setSelectedStage(stage) : setSelectedStage(null)
          }
        />
        <Pagination
          color="primary"
          count={currentPageCount}
          page={currentPage}
          onChange={(_, page) => loadData(page)}
        />
      </Box>
      <CaseList cases={cases} sx={{ mt: 4 }} />
    </Box>
  );
}
