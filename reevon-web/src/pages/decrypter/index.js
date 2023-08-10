import React, { useState } from "react";
import Swal from "sweetalert2";
import "./main.css";
import shortid from "shortid";
import "bootstrap/dist/css/bootstrap.css";
import Header from "../../components/Header/Header";
import { ApiService } from "../../services/api";

const Decrypter = () => {
  const [fileType, setFileType] = useState("xml");
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
      Swal.fire("Error", "Please choose a file to decrypt.", "error");
    } else {
      if (fileType === "xml" && !selectedFile.name.endsWith(".xml")) {
        Swal.fire(
          "Error",
          "Please select an XML file for decryption.",
          "error"
        );
        return;
      } else if (fileType === "json" && !selectedFile.name.endsWith(".json")) {
        Swal.fire(
          "Error",
          "Please select a JSON file for decryption.",
          "error"
        );
        return;
      }

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
          convertToCSV(selectedFile, id, secret);
        }
      });
    }
  };

  const convertToCSV = (file, id, secret) => {
    const apiService = new ApiService();
    const reader = new FileReader();
    reader.onload = () => {
      let convertPromise;
  
      if (fileType === "xml") {
        convertPromise = apiService.convertXMLToCSV(file, delimiter, secret);
      } else if (fileType === "json") {
        convertPromise = apiService.convertJSONToCSV(file, delimiter, secret);
      } else {
        Swal.fire({
          icon: "error",
          title: "Unsupported File Type",
          text: "Only XML and JSON files are supported.",
        });
        return;
      }
  
      convertPromise
        .then((response) => {
          const convertedFileName = `${id}_decrypted.csv`;
          const csvContent = response;
          console.log(csvContent)
          saveFileLocally(csvContent, convertedFileName);
          Swal.fire({
            icon: "success",
            title: "File Decryption Success",
            footer: "Decrypted File Name: " + convertedFileName,
          });
        })
        .catch((error) => {
          console.log(error)
          Swal.fire({
            icon: "error",
            title: "File Decryption Error",
            text: "Error decrypting file to CSV",
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
            "text/plain": [`.cvs`],
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
                      <h5 className="card-title mb-3">File Decrypter</h5>
                    </div>
                    <div className="card-body">
                      <div className="card text-center">
                        <div className="card-body">
                          <p
                            className="card-text mb-3 "
                            style={{
                              marginRight: "230px",
                            }}
                          >
                            Set the parameters of the file to decrypt:
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
                              accept={`.${fileType}`}
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
                            Decrypt
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

export default Decrypter;
