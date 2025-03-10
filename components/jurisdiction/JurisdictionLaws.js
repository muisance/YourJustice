import LawList from 'components/law/LawList';
import useLaw from 'hooks/useLaw';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction laws.
 */
export default function JurisdictionLaws({ jurisdiction }) {
  const { showToastError } = useToasts();
  const { getLawsByJurisdiction } = useLaw();
  const [laws, setLaws] = useState(null);

  async function loadData() {
    try {
      setLaws(await getLawsByJurisdiction(jurisdiction.id));
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (jurisdiction) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdiction]);

  return <LawList laws={laws} />;
}
