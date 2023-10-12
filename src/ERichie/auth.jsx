import axios from "axios";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/erichieplatform/databases/(default)/documents";

export const storeUserInFirestore = async (userdata) => {
  const apiUrl = `${baseUrl}/Users`;

  const payload = {
    fields: {
      name: { stringValue: userdata.name },
      email: { stringValue: userdata.email },
      role: { stringValue: userdata.role },
    },
  };

  const response = await axios.post(apiUrl, payload);
  if (response.status === 200) {
    console.log("User added successfully:", response.data);
  } else {
    console.error("Error adding user:", response.statusText);
    console.error("Response data:", response.data);
  }
};

export const checkUserRole = async (user) => {
  const apiUrl = `${baseUrl}/Users`;
  const response = await axios.get(apiUrl);
  if (response.status === 200) {
    const userData = response.data;
    if (userData.documents) {
      const userDocuments = userData.documents;
      const signedInUserRole = userDocuments.find((document) => {
        if (document.fields.email.stringValue == user.email) {
          return document.fields.role.stringValue;
        }
      });
      const role = signedInUserRole.fields.role.stringValue;
      return role;

      //   return signedInUser.documents.fields.role;
    }
  }
};
