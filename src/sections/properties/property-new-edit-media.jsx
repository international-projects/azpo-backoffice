import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import { styled } from '@mui/material/styles';
// MUI Components
import { Box, Card, Stack, Typography, CardHeader, CardContent } from '@mui/material';

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
  const { control, watch } = useFormContext();
  const images = watch('images');
  const pdfs = watch('pdfs');

  const handleDropImages = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      control.setValue('images', [...control.getValues().images, ...files]);
    },
    [control]
  );

  const handleDropPdfs = useCallback(
    (acceptedFiles) => {
      control.setValue('pdfs', [...control.getValues().pdfs, ...acceptedFiles]);
    },
    [control]
  );

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: handleDropImages,
    accept: 'image/*',
  });
  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    onDrop: handleDropPdfs,
    accept: '.pdf',
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
          {/* Add image previews here */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="PDF Attachments" />
        <CardContent>
          <Box {...getPdfRootProps()} component={DropZoneStyle}>
            <input {...getPdfInputProps()} />
            <Typography>Drag & drop or click to select PDFs</Typography>
          </Box>
          {/* Add PDF list here */}
        </CardContent>
      </Card>
    </Stack>
  );
}
