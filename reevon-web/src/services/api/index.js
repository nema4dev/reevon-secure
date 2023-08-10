export const BASE_URL = "https://localhost:7094";
let instance;

const postData = async (path, body) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: body,
  });

  return response;
};

export const ApiService = class {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  convertToXML(file, separator, secret) {
    const formData = new FormData();
    formData.append("document", file, file.name);
    formData.append("separator", separator);
    formData.append("key", secret);

    return postData(`/document/xml`, formData).then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((errorText) => {
          console.log(errorText);
          throw new Error("Error in the request");
        });
      }
    });
  }

  convertToJSON(file, separator, secret) {
    const formData = new FormData();
    formData.append("document", file, file.name);
    formData.append("separator", separator);
    formData.append("key", secret);

    return postData(`/document/json`, formData).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.text().then((errorText) => {
          console.log(errorText);
          throw new Error("Error in the request");
        });
      }
    });
  }

  convertXMLToCSV(file, separator, secret) {
    const formData = new FormData();
    formData.append("document", file, file.name);
    formData.append("separator", separator);
    formData.append("key", secret);

    return postData(`/document/CsvXml`, formData).then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((errorText) => {
          console.log(errorText);
          throw new Error("Error in the request");
        });
      }
    });
  }

  convertJSONToCSV(file, separator, secret) {
    const formData = new FormData();
    formData.append("document", file, file.name);
    formData.append("separator", separator);
    formData.append("key", secret);

    return postData(`/document/CsvJson`, formData).then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return response.text().then((errorText) => {
          console.log(errorText);
          throw new Error("Error in the request");
        });
      }
    });
  }
};
