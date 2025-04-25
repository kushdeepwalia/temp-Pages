import { useEffect, useState, useRef } from "react";
import { X, Upload, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui/select";
import { useToast } from "../Components/ui/use-toast";
import { CheckCircle } from "lucide-react";
import JSZip from "jszip";
import { objectData } from "./ModelList";
// Update the model type
export interface ModelData {
  id: number;
  modelName: string;
  projectName: string;
  markerFile: string;
  markerName: string;
  fileLinks: string[];
  fileNames: string[];
  timestamp: string;
}

const ModelUploadForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData as objectData | undefined;
  const [modelName, setModelName] = useState("");
  const [projectName, setProjectName] = useState(editData?.project_name || "");
  const [markerFile, setMarkerFile] = useState<File | null>(null);
  // const [modelFiles, setModelFiles] = useState<
  //   Array<{ file: File | null; type: string }>
  // >(
  //   editData
  //     ? editData.fileLinks.map(() => ({ file: null, type: "" }))
  //     : [{ file: null, type: "" }]
  // );
  const [modelFiles, setModelFiles] = useState({
    zip: null,
    model: null,
    text: null,
    audio: null,
    video: null,
  });
  const [extracted, setExtracted] = useState({
    model: null,
    text: null,
    audio: null,
    video: null,
  });
  const [uploadId, setUploadId] = useState(null);
  const { toast } = useToast();
  const dropZoneRef = useRef<HTMLDivElement | null>(null);
  const markerDropZoneRef = useRef<HTMLDivElement | null>(null);

  const handleMarkerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setMarkerFile(file);
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "") // Remove file extension
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

      setModelName(cleanName);
    }
  };
  const handleFileChange = async (type, e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      const fileTypes = {
        model: [".glb", ".obj", ".fbx"],
        text: [".txt", ".doc", ".pdf"],
        audio: [".mp3", ".m4a"],
        video: [".mp4"],
        zip: [".zip"],
      };

      const isValidFileType = fileTypes[type].some((ext) =>
        file.name.endsWith(ext)
      );

      if (!isValidFileType) {
        alert(
          `Invalid file type for ${type.toUpperCase()}. Allowed formats: ${fileTypes[
            type
          ].join(", ")}`
        );
        return;
      }

      if (type === "zip") {
        // Extract ZIP and replace files in state
        const extractedFiles = await extractZip(file);
        // Remove ZIP and set extracted files
        setExtracted(extractedFiles); // Remove ZIP and set extracted files
      } else {
        setModelFiles((prev) => ({ ...prev, [type]: file }));
        setExtracted((prev) => ({ ...prev, [type]: file }));
      }
    }
  };

  const extractZip = async (file) => {
    const zip = new JSZip();
    const zipContents = await zip.loadAsync(file);

    const extractedFiles = {
      model: null,
      text: null,
      audio: null,
      video: null,
    };

    const filePromises = Object.keys(zipContents.files).map(
      async (filename) => {
        const fileData = await zipContents.files[filename].async("blob");
        const fileType = determineFileType(filename);

        if (fileType) {
          extractedFiles[fileType] = new File([fileData], filename);
        }
      }
    );

    await Promise.all(filePromises);
    return extractedFiles;
  };

  // Function to determine the file type based on extension
  const determineFileType = (filename) => {
    const fileExtensions = {
      model: [".glb", ".obj", ".fbx"],
      text: [".txt", ".doc", ".pdf"],
      audio: [".mp3", ".m4a"],
      video: [".mp4"],
    };

    for (const [type, extensions] of Object.entries(fileExtensions)) {
      if (extensions.some((ext) => filename.endsWith(ext))) {
        return type;
      }
    }
    return null; // Return null for unknown file types
  };

  const removeFile = (type) => {
    setModelFiles((prev) => ({ ...prev, [type]: null }));
    setExtracted((prev) => ({ ...prev, [type]: null }));
  };

  // const handleModelFileChange = (
  //   index: number,
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (e.target.files?.[0]) {
  //     const newModelFiles = [...modelFiles];
  //     newModelFiles[index] = {
  //       ...newModelFiles[index],
  //       file: e.target.files[0],
  //     };
  //     setModelFiles(newModelFiles);
  //   }
  // };
  const initiateUpload = async (file: File, type: string) => {
    try {
      const bodyx = {
        project_name: projectName,
        object_name: modelName,
        file_name: file.name,
        file_type: type,
      };
      console.log("Initializing upload with headers:", bodyx);

      const response = await fetch(
        `https://e60tr3t3xe.execute-api.ap-south-1.amazonaws.com/dev/models/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ✅ Only necessary header
          },
          body: JSON.stringify(bodyx),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to initialize upload: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Upload initialized. Upload ID:", data.uploadId);

      setUploadId(data.uploadId); // Assuming you have a state setter for uploadId
      return data.uploadId;
    } catch (error) {
      console.error("Error in initiateUpload:", error);
      throw error;
    }
  };

  const uploadPart = async (
    file: File,
    partNumber,
    chunk,
    uploadId,
    type: string
  ) => {
    const bodyx = {
      project_name: projectName,
      object_name: modelName,
      file_name: file.name,
      file_type: type,
      upload_id: uploadId,
      part_number: partNumber,
    };
    console.log("Uploading part with headers:", bodyx);

    try {
      // Step 1: Get pre-signed URL for the part
      const presignedUrlResponse = await fetch(
        `https://e60tr3t3xe.execute-api.ap-south-1.amazonaws.com/dev/models`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyx),
        }
      );

      if (!presignedUrlResponse.ok) {
        throw new Error(
          `Failed to get pre-signed URL: ${presignedUrlResponse.statusText}`
        );
      }

      const { presignedUrl } = await presignedUrlResponse.json();
      console.log("Pre-signed URL received for part", partNumber);

      // Step 2: Upload the chunk to the pre-signed URL
      const uploadResponse = await fetch(`${presignedUrl}`, {
        method: "PUT",
        headers: {
          "content-type": file.type,
        },
        body: chunk,
      });
      console.log("RESPONSE:", uploadResponse);
      console.log("headers:", uploadResponse.headers.get("Headers"));
      if (!uploadResponse.ok) {
        throw new Error(
          `Failed to upload part ${partNumber}: ${uploadResponse.statusText}`
        );
      }

      const eTag = uploadResponse.headers.get("ETag");
      console.log("Part", partNumber, "uploaded successfully. ETag:", eTag);

      return { ETag: eTag, PartNumber: partNumber };
    } catch (error) {
      console.error(`Error uploading part ${partNumber}:`, error);
      throw error;
    }
  };

  const completeUpload = async (file: File, uploadId, parts, type: string) => {
    try {
      console.log("Completing upload with upload ID:", uploadId);

      const response = await fetch(
        `https://e60tr3t3xe.execute-api.ap-south-1.amazonaws.com/dev/models/uploadComp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_name: projectName,
            object_name: modelName,
            file_name: file.name,
            file_type: type,
            upload_id: uploadId,
            parts,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to complete upload: ${response.statusText}`);
      }

      console.log("Upload completed successfully!");
    } catch (error) {
      console.error("Error in completeUpload:", error);
      throw error;
    }
  };

  const handleUpload = async (file, type) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      console.log("Starting upload process...");

      // Step 1: Initialize upload and get upload ID
      const uploadId = await initiateUpload(file, type);
      console.log("Upload ID:", uploadId);

      // Step 2: Split file into chunks and upload each part
      const chunkSize = 5 * 1024 * 1024; // 5MB
      const chunks = [];
      let partNumber = 1;

      for (let start = 0; start < file.size; start += chunkSize) {
        const chunk = file.slice(start, start + chunkSize);
        let retries = 3; // Retry logic for failed uploads
        let partData;

        while (retries > 0) {
          try {
            partData = await uploadPart(
              file,
              partNumber,
              chunk,
              uploadId,
              type
            );
            chunks.push(partData);
            break; // Exit retry loop on success
          } catch (error) {
            retries--;
            if (retries === 0) throw error; // Throw error if all retries fail
            console.log(`Retrying part ${partNumber}...`);
          }
        }

        partNumber++;
      }

      console.log("All parts uploaded. Parts:", chunks);

      // Step 3: Complete the upload
      await completeUpload(file, uploadId, chunks, type);
      console.log("Upload process finished successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // const handleFileTypeChange = (index: number, value: string) => {
  //   const newModelFiles = [...modelFiles];
  //   newModelFiles[index] = { ...newModelFiles[index], type: value };
  //   setModelFiles(newModelFiles);
  // };
  // const handleDragOver = (
  //   index: number,
  //   e: React.DragEvent<HTMLDivElement>
  // ) => {
  //   e.preventDefault();
  //   if (dropZoneRef.current) {
  //     dropZoneRef.current.classList.add("border-blue-500"); // Highlight the drop zone
  //   }
  // };

  // const handleDragLeave = (
  //   index: number,
  //   e: React.DragEvent<HTMLDivElement>
  // ) => {
  //   if (dropZoneRef.current) {
  //     dropZoneRef.current.classList.remove("border-blue-500"); // Remove highlight
  //   }
  // };

  // const handleDrop = (index: number, e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();

  //   if (e.dataTransfer.files.length > 0) {
  //     const newModelFiles = [...modelFiles];
  //     newModelFiles[index] = {
  //       ...newModelFiles[index],
  //       file: e.dataTransfer.files[0],
  //     };
  //     setModelFiles(newModelFiles);
  //   }

  //   if (dropZoneRef.current) {
  //     dropZoneRef.current.classList.remove("border-blue-500");
  //   }
  // };
  const handleDrop = async (type, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(type, { target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleMarkerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    markerDropZoneRef.current?.classList.add("border-blue-500");
  };

  const handleMarkerDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    markerDropZoneRef.current?.classList.remove("border-blue-500");
  };

  const handleMarkerDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setMarkerFile(file);
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "") // Remove file extension
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

      setModelName(cleanName);
    }
    markerDropZoneRef.current?.classList.remove("border-blue-500");
  };

  // const addNewModelFile = () => {
  //   setModelFiles([...modelFiles, { file: null, type: "" }]);
  // };

  const removeModelFile = (index: number) => {
    if (modelFiles.length > 1) {
      const newModelFiles = modelFiles.filter((_, i) => i !== index);
      setModelFiles(newModelFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (
      !modelName ||
      !projectName ||
      !markerFile ||
      Object.values(modelFiles).every((file) => !file)
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({ title: "Uploading files...", description: "Please wait..." });

      // Upload marker file
      await handleUpload(markerFile, "marker");

      for (const file in extracted) {
        const value = extracted[file];
        if (value) {
          console.log(file, value);
          await handleUpload(value, file);
        }
      }
      // Upload all selected files
      // for (const file of Object.values(extracted)) {
      //   if (file) await handleUpload(file);
      // }

      // Save details in localStorage
      // const existingModels = JSON.parse(
      //   localStorage.getItem("arModels") || "[]"
      // );

      const newModel: ModelData = {
        id: Date.now(),
        modelName,
        projectName,
        markerFile: markerFile.name, // Store file name instead of Blob URL
        markerName: markerFile.name,
        fileLinks: Object.values(modelFiles).map((file) =>
          file ? file.name : ""
        ),
        fileNames: Object.values(modelFiles).map((file) =>
          file ? file.name : ""
        ),
        timestamp: new Date().toISOString(),
      };

      // localStorage.setItem(
      //   "arModels",
      //   JSON.stringify([...existingModels, newModel])
      // );

      toast({ title: "Success", description: "Model uploaded successfully" });

      // Navigate back after a slight delay to ensure uploads are finished
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Error",
        description: "Upload failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fileTypes = {
    zip: [".zip"],
    model: [".glb", ".obj", ".fbx"],
    text: [".txt", ".doc", ".pdf"],
    audio: [".mp3", ".m4a"],
    video: [".mp4"],
  };

  return (
    <div className="">
      {/* <h2 className="text-xl font-semibold mb-6">Upload AR Model</h2> */}
      <div className=" justify-between h-22">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-medium tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {editData ? "Update" : "Upload"} AR Model
          </h2>
          {/* <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" asChild>
              <Link to="/">Cancel</Link>
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {editData ? "Update" : "Submit"} Files
            </Button>
          </div> */}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="gap-2 flex flex-col bg-white p-6 rounded-xl shadow-lg">
          <label className="PROJECT_NAME text-sm font-medium text-gray-700 ">
            Project Name
          </label>
          <div className="DropDown">
            <Select onValueChange={setProjectName}>
              <SelectTrigger className="w-full bg-white shadow-sm  h-10">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSC">CSC</SelectItem>
                <SelectItem value="Anganwadi">Anganwadi</SelectItem>
                <SelectItem value="AWC-AlphabetBook">
                  AWC-AlphabetBook
                </SelectItem>
                <SelectItem value="AWC-VarnmalaBook">
                  AWC-VarnmalaBook
                </SelectItem>
                <SelectItem value="Alphabet">Alphabet</SelectItem>
                <SelectItem value="Varnmala">Varnmala</SelectItem>
                <SelectItem value="ARAnimal">AR Animal</SelectItem>
                <SelectItem value="Other">Other</SelectItem>

              </SelectContent>
            </Select>

            {/* <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="w-full"
          /> */}
          </div>

          <label className="MARKER text-sm font-medium text-gray-700 mt-4">
            Upload or Drop Marker
          </label>
          <div
            className=" border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-gray-50/50 hover:bg-gray-50"
            ref={markerDropZoneRef}
            onDragOver={handleMarkerDragOver}
            onDragLeave={handleMarkerDragLeave}
            onDrop={handleMarkerDrop}
          >
            {/* <p className="text-sm text-gray-500 mb-2">
            Max file size is 500kb. Supported file types are...
          </p> */}
            <div className="flex items-center gap-2  max-w-fit m-auto ">
              <Input
                type="file"
                onChange={handleMarkerFileChange}
                className="hidden"
                id="marker-file"
              />
              <label
                htmlFor="marker-file"
                className="px-4 py-2 border rounded-md hover:bg-gray-50 cursor-pointer flex items-center gap-2"
              >
                <Upload className="h-4 w-4 " />
                Choose or Drop File
              </label>
              {markerFile && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-md">
                  <span className="text-sm">{markerFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setMarkerFile(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <label className="Learning Object Name text-sm font-medium text-gray-700 mt-4">
            Learning Object Name
          </label>
          <div className="">
            <div className="relative w-full">
              <Input
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Upload Marker"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white shadow-sm pr-10"
              />
              {modelName && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
          </div>

          <label className="UploadFiles text-sm font-medium text-gray-700 mt-4">
            Upload Files
          </label>
          <div className="md:flex ZIP gap-4 md:space-y-0 space-y-6    ">
            {/* ZIP Upload Button on One Side */}
            <div className="border-2 flex  h-32 border-dashed border-gray-200 rounded-xl  px-10 text-center hover:border-primary/50 transition-colors bg-gray-50/50 hover:bg-gray-50 ">
              <label
                htmlFor="zip"
                className="cursor-pointer flex items-center gap-3 text-gray-700 font-medium hover:text-gray-900 justify-center"
              >
                <Upload className="h-5 w-5 text-blue-600" /> Upload ZIP
              </label>
              <input
                type="file"
                id="zip"
                className="hidden"
                accept=".zip"
                onChange={(e) => handleFileChange("zip", e)}
              />
              {modelFiles.zip && (
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">
                    {modelFiles.zip.name}
                  </span>
                  <button
                    onClick={() => removeFile("zip")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            {/* Other File Upload Buttons on the Other Side */}
            {/* <Button
              variant="ghost"
              className="flex max-w-fit items-center justify-center gap-2 hover:bg-gray-100/80 transition-colors rounded-xl mt-4 text-base font-medium"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission (if inside a form)
                setShowIndividualUploads(!showIndividualUploads);
              }}
            >
              Select Individual
              {showIndividualUploads ? (
                <ChevronUp className="w-5 h-5 ml-1" />
              ) : (
                <ChevronDown className="w-5 h-5 ml-1" />
              )}
            </Button>
            {showIndividualUploads && ()} */}

            <div className="grid grid-cols-2 gap-4">
              {["model", "text", "audio", "video"].map((type) => (
                <div
                  key={type}
                  className="md:flex lg:flex-row flex-col  items-center justify-between gap-2  md:p-4 md:text-[14px] shadow-sm hover:shadow-md border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-gray-50/50 hover:bg-gray-50"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(type, e)}
                >
                  <label
                    htmlFor={type}
                    className="cursor-pointer flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900"
                  >
                    <Upload className="h-5 w-5 text-blue-600" /> Upload {type}
                  </label>
                  <input
                    type="file"
                    id={type}
                    className="hidden"
                    accept={fileTypes[type].join(", ")}
                    onChange={(e) => handleFileChange(type, e)}
                  />
                  {modelFiles[type] && (
                    <div className="flex max-w-fit items-center gap-2 bg-gray-100 p-2 rounded-lg">
                      <span className="md:text-sm  text-gray-700">
                        {modelFiles[type].name}
                      </span>
                      <button
                        onClick={() => removeFile(type)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="BUTTONS flex justify-end gap-5 pt-4">
          <Button variant="outline" type="button" asChild>
            <Link to="/">Cancel</Link>
          </Button>
          <Button type="submit">{editData ? "Update" : "Submit"} Files</Button>
        </div>
      </form>
    </div>
  );
};

export default ModelUploadForm;
