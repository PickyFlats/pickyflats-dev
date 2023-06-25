export interface Message {
  conversationID: string;
  senderID: string;
  message: string;
  attachments: any[];

  // read/delivered !FEATURE UPDATE
  isRead: boolean;
  isDelivered: boolean;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
