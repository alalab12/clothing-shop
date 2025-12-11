<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleClose">
    <div class="modal-dialog" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ title }}</h3>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="ok-btn" @click="handleClose">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertModal',
  props: {
    title: {
      type: String,
      default: 'Error'
    },
    message: {
      type: String,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const handleClose = () => {
      emit('close')
    }

    return {
      handleClose
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-dialog {
  background: #2c2c2c;
  border-radius: 8px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.modal-content {
  padding: 0;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #444;
}

.modal-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;
}

.modal-body {
  padding: 2rem 1.5rem;
}

.modal-body p {
  margin: 0;
  color: #ddd;
  font-size: 1rem;
  line-height: 1.5;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.ok-btn {
  background: #5bc0de;
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.ok-btn:hover {
  background: #46b8da;
}

.ok-btn:active {
  transform: scale(0.98);
}
</style>
