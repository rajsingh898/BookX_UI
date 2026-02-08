import api from "./api";
import axios from 'axios';


export const bookService = {
  getAllBooks: () => api.get("/books/all"),
  getMyBooks: () => api.get("/books/owned"),
  getWantedBooks: () => api.get("/books/wanted"),

   addToMyBooks: (book,options) =>
    api.post("/books/owned", {
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: options.condition,
      readStatus: options.readStatus,
      exchangeReady: options.exchangeReady
    }),

 addToWanted(book) {
  return api.post("/books/wanted", {
    title: book.title,
    author: book.author,
    genre: book.genre
  });
},
  removeFromWanted(bookId)   {
  return api.delete("/books/wanted", {
   params: { bookId }
  });
},
removeFromOwned(bookId)   {
  return api.delete("/books/owned", {
   params: { bookId }
  });
},
updateOwnedBook(bookId, payload) {
  return api.patch("/books/update" , payload, { params: { bookId } });
},
askChatbot: (question) =>
  api.get(`/chat/${encodeURIComponent(question)}`),

getExchangeMatches: (ownedBookId) =>
  api.get(`/books/exchange/matches/${ownedBookId}`),

 
getUserInfo: (id) => {
  return api.get(`/auth/users/info/${id}`);
},
sendMail: (payload) =>
  api.post("/books/send-email", payload),



  toggleReadStatus: (bookId) =>
    api.put(`/owned-books/${bookId}/toggle`),
  getDashboardStats: () => api.get("/books/stats"),
  getCurrentUser: () => api.get("/auth/users/me")
};
