import React, { useState } from "react";
import Swal from "sweetalert2";
import shortid from "shortid";
import "./main.css";
import "bootstrap/dist/css/bootstrap.css";
import Header from "../../components/Header/Header";
import { ApiService } from "../../services/api";

const apiService = new ApiService();

const Encrypter = () => {
  const [fileType, setFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [delimiter, setDelimiter] = useState(",");

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDelimiterChange = (e) => {
    setDelimiter(e.target.value);
  };

  const handleGenerateClick = () => {
    if (!selectedFile) {
      Swal.fire("Error", "Please choose a file to encrypt.", "error");
    } else if (selectedFile.type !== "text/csv") {
      Swal.fire("Error", "Please select a CSV file for encryption.", "error");
    } else {
      Swal.fire({
        title: "Enter Secret Key",
        input: "password",
        inputPlaceholder: "Enter your secret key",
        showCancelButton: true,
        confirmButtonText: "Accept",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return "Please enter a secret key";
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const secret = result.value;
          const id = shortid.generate().substring(0, 5);
          if (fileType === "xml") {
            convertToXML(selectedFile, id, secret);
          } else if (fileType === "json") {
            convertToJSON(selectedFile, id, secret);
          }
        }
      });
    }
  };

  const convertToXML = (file, id, secret) => {
    const reader = new FileReader();
    reader.onload = () => {
      return apiService
        .convertToXML(file, delimiter, secret)
        .then((xmlContent) => {
          const convertedFileName = `${id}_encrypted.xml`;
          saveFileLocally(xmlContent, convertedFileName);
          Swal.fire({
            icon: "success",
            title: "File Encryption Success",
            footer: "Encrypted File Name: " + convertedFileName,
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "File Encrypt Error",
            text: "Error encrypting file to XML",
          });
        });
    };
    reader.readAsText(file);
  };

  const convertToJSON = (file, id, secret) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log(file)
      return apiService
        .convertToJSON(file, delimiter, secret)
        .then((jsonContent) => {
          const convertedFileName = `${id}_encrypted.json`;
          saveFileLocally(JSON.stringify(jsonContent), convertedFileName);
          Swal.fire({
            icon: "success",
            title: "File Encryption Success",
            footer: "Encrypted File Name: " + convertedFileName,
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "File Encryption Error",
            text: "Error encrypting file to JSON",
          });
        });
    };
    reader.readAsText(file);
  };

  async function saveFileLocally(content, fileName) {
    const options = {
      suggestedName: fileName,
      types: [
        {
          description: "Text file",
          accept: {
            "text/plain": [`.${fileType}`],
          },
        },
      ],
    };

    try {
      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
    }
  }

  return (
    <>
      <Header />
      <div className="container pt-5">
        <div className="row pt-5">
          <div className="col-3"></div>
          <div className="col-6">
            <div className="card cardback card1">
              <div className="card-body cardback">
                <form>
                  <div className="card text-centers">
                    <div className="card-header">
                      <h5 className="card-title mb-3">File Encrypter</h5>
                    </div>
                    <div className="card-body">
                      <div className="card text-center">
                        <div className="card-body">
                          <p
                            className="card-text "
                            style={{
                              marginRight: "230px",
                            }}
                          >
                            Set the parameters of the file to encrypt:
                          </p>
                      
                          <select
                            className="form-select mb-3"
                            aria-label="Select File Type"
                            onChange={handleFileTypeChange}
                          >
                            <option value="xml">XML</option>
                            <option value="json">JSON</option>
                          </select>
                          <div className="input-group mb-3">
                            <input
                              type="file"
                              className="form-control"
                              accept={`.csv`}
                              id="formFileMultiple"
                              multiple
                              onChange={handleFileInputChange}
                            />
                          </div>

                          <div className="form-group mt-3">
                            <select
                              className="form-select mb-3"
                              aria-label="Select Character Delimiter"
                              value={delimiter}
                              onChange={handleDelimiterChange}
                            >
                              <option value=",">Comma (,)</option>
                              <option value=".">Period (.)</option>
                              <option value="-">Dash (-)</option>
                              <option value=";">Semicolon (;)</option>
                              <option value="_">Underscore (_) </option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-2 d-flex justify-content-center">
                          <button
                            type="button"
                            className="btn btn-dark buttonbacks min-width-button mb-2"
                            onClick={handleGenerateClick}
                          >
                            Encrypt
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer text-muted"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-3"></div>
        </div>
      </div>
    </>
  );
};

export default Encrypter;
