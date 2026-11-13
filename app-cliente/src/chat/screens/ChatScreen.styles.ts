
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  keyboardContainer: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111827',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },

  errorText: {
    color: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  messageList: {
    flex: 1,
  },

  messageListContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexGrow: 1,
  },

  messageItem: {
    marginVertical: 4,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    fontSize: 14,
    color: '#111827',
  },

  sendButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
