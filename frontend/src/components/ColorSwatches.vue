<template>
  <view class="flex flex-wrap items-center gap-3">
    <view
      v-for="color in colors"
      :key="color"
      class="flex h-10 w-10 items-center justify-center rounded-full border-2"
      :class="modelValue === color ? 'border-brand-500' : 'border-line'"
      @tap="emit('update:modelValue', color)"
    >
      <view class="h-8 w-8 rounded-full border border-line" :style="{ backgroundColor: color }" />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{ colors: string[]; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [color: string] }>()
</script>
