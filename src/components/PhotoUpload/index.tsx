import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

interface PhotoUploadProps {
  photos: string[]
  max?: number
  onChange?: (photos: string[]) => void
  readonly?: boolean
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  max = 9,
  onChange,
  readonly = false
}) => {
  const handleChoose = () => {
    if (readonly) return
    Taro.chooseImage({
      count: max - photos.length,
      success: (res) => {
        const newPhotos = [...photos, ...res.tempFilePaths]
        onChange && onChange(newPhotos)
      }
    }).catch((err) => {
      console.error('[PhotoUpload] chooseImage failed:', err)
    })
  }

  const handleRemove = (index: number) => {
    if (readonly) return
    const newPhotos = photos.filter((_, i) => i !== index)
    onChange && onChange(newPhotos)
  }

  const handlePreview = (index: number) => {
    Taro.previewImage({
      current: photos[index],
      urls: photos
    })
  }

  return (
    <View className={styles.container}>
      {photos.map((url, index) => (
        <View key={index} className={styles.photoItem}>
          <Image
            className={styles.photo}
            src={url}
            mode="aspectFill"
            onClick={() => handlePreview(index)}
          />
          {!readonly && (
            <View className={styles.removeBtn} onClick={() => handleRemove(index)}>
              <Text className={styles.removeText}>×</Text>
            </View>
          )}
        </View>
      ))}
      {!readonly && photos.length < max && (
        <View className={styles.addBtn} onClick={handleChoose}>
          <Text className={styles.addIcon}>+</Text>
          <Text className={styles.addText}>上传照片</Text>
        </View>
      )}
    </View>
  )
}

export default PhotoUpload
