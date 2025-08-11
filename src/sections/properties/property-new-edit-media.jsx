import { Icon } from '@iconify/react';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { styled } from '@mui/material/styles';
// MUI Components
import {
  Box,
  Card,
  List,
  Stack,
  Dialog,
  ListItem,
  Typography,
  CardHeader,
  IconButton,
  CardContent,
  ListItemText,
  DialogContent,
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
  const images = watch('imagesArr');
  const downloads = watch('downloadsArr');
  const [previewImage, setPreviewImage] = useState(null);

  const getImageUrl = (file) => {
    if (file.image) {
      // New base64 image
      return file.image;
    }
    if (file.file_name) {
      // Existing image from server
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/files/property-images/${file.file_name}`;
    }
    return `https://placehold.co/600x400/e0e0e0/333?text=No+Image`;
  };

  const handleRemoveImage = (fileToRemove) => {
    const identifier = fileToRemove.id || fileToRemove.name;
    setValue(
      'imagesArr',
      getValues().imagesArr.filter((file) => (file.id || file.name) !== identifier)
    );
  };

  const handleRemovePdf = (fileToRemove) => {
    setValue(
      'downloadsArr',
      getValues().downloadsArr.filter((file) => file.name !== fileToRemove.name)
    );
  };

  const handleDropImages = useCallback(
    (acceptedFiles) => {
      const currentImages = getValues().imagesArr || [];
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const newImage = {
              id: `${file.lastModified}-${file.size}`, // Unique ID for local files
              image: reader.result.toString(),
              name: file.name,
              order: currentImages.length + 1,
            };
            setValue('imagesArr', [...getValues().imagesArr, newImage]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [setValue, getValues]
  );

  const handleDropdownloads = useCallback(
    (acceptedFiles) => {
      const currentdownloads = getValues().downloadsArr || [];
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const newPdf = {
              file: reader.result.toString(),
              name: file.name,
              order: currentdownloads.length + 1,
            };
            setValue('downloadsArr', [...getValues().downloadsArr, newPdf]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [setValue, getValues]
  );

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: handleDropImages,
    accept: { 'image/*': [] },
  });
  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    onDrop: handleDropdownloads,
    accept: { 'application/pdf': [] },
  });

  return (
    <>
      <Stack spacing={3}>
        <Card>
          <CardHeader title="Property Images" />
          <CardContent>
            <Box {...getImageRootProps()} component={DropZoneStyle}>
              <input {...getImageInputProps()} />
              <Typography>Drag & drop or click to select images</Typography>
            </Box>
            <List>
              {images &&
                images.map((file, index) => (
                  <ListItem
                    key={file.id || index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveImage(file)}>
                        <Icon icon="mdi:close" />
                      </IconButton>
                    }
                  >
                    <img
                      src={getImageUrl(file)}
                      alt={file.name || file.file_name}
                      width={50}
                      height={50}
                      style={{
                        marginRight: '16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        objectFit: 'cover',
                      }}
                      onClick={() => setPreviewImage(getImageUrl(file))}
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
              <Typography>Drag & drop or click to select downloads</Typography>
            </Box>
            <List>
              {downloads &&
                downloads.map((file, index) => (
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
      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md">
        <DialogContent>
          <img src={previewImage} style={{ width: '100%' }} alt="Preview" />
        </DialogContent>
      </Dialog>
    </>
  );
}
