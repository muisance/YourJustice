import {
  Autocomplete,
  Box,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { throttle, unionWith } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

/**
 * A widget to select profile.
 */
export default function ProfileSelect(props) {
  const propsLabel = props.label;
  const propsSubLabel = props.options?.subLabel;
  const propsSize = props.size;
  const propsDisabled = props.disabled;
  const propsSx = props.sx;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const { showToastError } = useToasts();
  const { getProfile, getProfilesBySearchQuery } = useProfile();
  const [isDisabled, setIsDisabled] = useState(false);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  /**
   * A function to searching profiles by search query that runs once every defined amount of milliseconds.
   */
  const searchProfiles = useMemo(
    () =>
      throttle((searchQuery, callback) => {
        getProfilesBySearchQuery(searchQuery).then((profiles) =>
          callback(profiles),
        );
      }, 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    let isComponentActive = true;
    searchProfiles(inputValue, (profiles) => {
      if (isComponentActive) {
        let newOptions = [];
        // Add selected value to option list
        if (value) {
          newOptions = [value];
        }
        // Add found profiles to option list
        if (profiles) {
          newOptions = unionWith(
            newOptions,
            profiles,
            (profile1, profile2) => profile1.account === profile2.account,
          );
        }
        setOptions(newOptions);
      }
    });
    return () => {
      isComponentActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, value]);

  useEffect(() => {
    // Init selected value if props value is defined
    if (propsValue) {
      setIsDisabled(true);
      getProfile(propsValue)
        .then((profile) => {
          setValue(profile);
          setIsDisabled(false);
        })
        .catch((error) => showToastError(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Autocomplete
      sx={{ ...propsSx }}
      disabled={isDisabled || propsDisabled}
      getOptionLabel={(option) =>
        (option.avatarNftUriFirstName || 'None') +
        ' ' +
        (option.avatarNftUriLastName || 'None')
      }
      filterOptions={(x) => x}
      options={options}
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
        propsOnChange(newValue ? newValue.account : null);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      isOptionEqualToValue={(option, value) => option.account === value.account}
      renderInput={(params) => (
        <Box>
          {propsLabel && (
            <>
              <Typography sx={{ fontWeight: 'bold' }}>{propsLabel}</Typography>
              <Typography variant="body2">{propsSubLabel}</Typography>
              <Divider sx={{ mt: 1.5, mb: 2.5 }} />
            </>
          )}
          <TextField
            fullWidth
            {...params}
            size={propsSize}
            label="First name, last name, address"
          />
        </Box>
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <ProfileCompactCard
              profile={option}
              disableLink={true}
              sx={{ my: 0.6 }}
            />
          </li>
        );
      }}
    />
  );
}
