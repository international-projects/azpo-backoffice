import { useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import { styled } from '@mui/material/styles';
// MUI Components
import {
  Box,
  Card,
  List,
  Stack,
  ListItem,
  Typography,
  CardHeader,
  IconButton,
  CardContent,
  ListItemText,
} from '@mui/material';

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(3, 1),
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

export function PropertyNewEditMedia() {
  const { setValue, getValues, watch } = useFormContext();
  const images = watch('images');
  const pdfs = watch('pdfs');

  const handleRemoveImage = (fileToRemove) => {
    setValue(
      'images',
      getValues().images.filter((file) => file !== fileToRemove)
    );
  };

  const handleRemovePdf = (fileToRemove) => {
    setValue(
      'pdfs',
      getValues().pdfs.filter((file) => file !== fileToRemove)
    );
  };

  const handleDropImages = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setValue('images', [...getValues().images, ...files]);
    },
    [setValue, getValues]
  );

  const handleDropPdfs = useCallback(
    (acceptedFiles) => {
      setValue('pdfs', [...getValues().pdfs, ...acceptedFiles]);
    },
    [setValue, getValues]
  );

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: handleDropImages,
    accept: { 'image/*': [] },
  });
  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    onDrop: handleDropPdfs,
    accept: { 'application/pdf': [] },
  });

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title="Property Images" />
        <CardContent>
          <Box {...getImageRootProps()} component={DropZoneStyle}>
            <input {...getImageInputProps()} />
            <Typography>Drag & drop or click to select images</Typography>
          </Box>
          <List>
            {images.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveImage(file)}>
                    <Icon icon="mdi:close" />
                  </IconButton>
                }
              >
                <img
                  src={file.preview || file.file_name}
                  alt={file.name}
                  width={50}
                  height={50}
                  style={{ marginRight: '16px', borderRadius: '4px' }}
                />
                <ListItemText primary={file.name || file.file_name} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="PDF Attachments" />
        <CardContent>
          <Box {...getPdfRootProps()} component={DropZoneStyle}>
            <input {...getPdfInputProps()} />
            <Typography>Drag & drop or click to select PDFs</Typography>
          </Box>
          <List>
            {pdfs.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemovePdf(file)}>
                    <Icon icon="mdi:close" />
                  </IconButton>
                }
              >
                <Icon
                  icon="mdi:file-pdf-box"
                  width={40}
                  height={40}
                  style={{ marginRight: '16px' }}
                />
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
}
