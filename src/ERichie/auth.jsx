import axios from "axios";

const baseUrl =
  "https://firestore.googleapis.com/v1/projects/erichiewebsite/databases/(default)/documents";

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
  const apiUrl = `${baseUrl}/Users?pageSize=100`;
  const response = await axios.get(apiUrl);
  console.log(response);
  if (response.status === 200) {
    const userData = response.data;
    if (userData.documents) {
      const userDocuments = userData.documents;
      console.log(userDocuments);
      const signedInUserRole = userDocuments.find((document) => {
        console.log(document);
        if (document.fields.email.stringValue == user.email) {
          return document.fields.role.stringValue;
        }
      });
      console.log(user.email);
      console.log(signedInUserRole);
      const role = signedInUserRole.fields.role.stringValue;
      return role;

      //   return signedInUser.documents.fields.role;
    }
  }
};
