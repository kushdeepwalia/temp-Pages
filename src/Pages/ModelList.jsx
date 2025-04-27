import { ArrowUpDown, Eye, Pencil, Trash2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Components/ui/table";
import { Button } from "../Components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ModelData } from "./ModelUploadForm";
import { useToast } from "../Components/ui/use-toast";
import { Input } from "../Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const ModelList = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [load, setloadingPage] =  useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloads, setDownloads]  = useState(0);
  const [valids, setvalids]  = useState(0);
  const { toast } = useToast();

  const saveToIndexedDB = async (modelName, fileBlob) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ModelStorageDB", 1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("models")) {
          db.createObjectStore("models", { keyPath: "name" });
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("models", "readwrite");
        const store = transaction.objectStore("models");
  
        store.put({ name: modelName, data: fileBlob });
  
        transaction.oncomplete = () => {
          console.log("Model saved to IndexedDB:", modelName);
          resolve(true);
          setvalids(prev => prev + 1)
        };
  
        transaction.onerror = (error) => reject(error);
      };
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request.onerror = (error) => reject(error);
    });
  };


  const downloadFile = async(object) => {

  //   Object.entries(object.file_name).forEach(async([key,fileName]) => {
  //     console.log(fileName)
  //     if(fileName.length > 0) {
  //     setDownloads(prev => prev+1)
  //     const presignedUrlResponse = await fetch(
  //       `https://e60tr3t3xe.execute-api.ap-south-1.amazonaws.com/dev/?object_name=${object.object_name}&file_name=${fileName[0]}`,
  //       {
  //         method: "GET",
  //         body: null
  //       }
  //     );
      
  //     if (!presignedUrlResponse.ok) {
  //       throw new Error(
  //         `Failed to get pre-signed URL: ${presignedUrlResponse.statusText}`
  //       );
  //     }
      
  //     const { presignedUrl } = await presignedUrlResponse.json();
  //     console.log("Pre-signed URL received for part", presignedUrl);
  //     const fileResponse = await fetch(presignedUrl);
  //     const blob = await fileResponse.blob();
  //     await saveToIndexedDB(key, blob)
    
      
  //     // const reader = new FileReader();
  //     // reader.readAsDataURL(blob);
  //     // reader.onload= async() => {
  //     //   const base64Data = reader.result;
  //     //   console.log(base64Data);
  //     // }

  //   }else {
  //     console.log("No file found for this object");
  //     await saveToIndexedDB(key, "")
  //   }
  // })
  const validFiles = Object.entries(object.file_name).filter(
    ([_, fileName]) => fileName.length > 0
  );

  if (validFiles.length === 0) {
    console.log("No valid files to download.");
    return;
  }

  try {
    const downloadPromises = validFiles.map(async ([key, fileNames]) => {
      console.log(`Downloading ${key}:`, fileNames);

      const presignedUrlResponse = await fetch(
        `https://e60tr3t3xe.execute-api.ap-south-1.amazonaws.com/dev/?object_name=${object.object_name}&file_name=${fileNames[0]}`
      );

      if (!presignedUrlResponse.ok) {
        throw new Error(
          `Failed to get pre-signed URL: ${presignedUrlResponse.statusText}`
        );
      }

      const { presignedUrl } = await presignedUrlResponse.json();
      console.log(`Pre-signed URL received for ${key}`, presignedUrl);

      const fileResponse = await fetch(presignedUrl);

      // ✅ Check if response is OK before processing
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
      }

      const blob = await fileResponse.blob();

      // ✅ Check if blob is empty
      if (blob.size === 0) {
        console.warn(`Empty blob received for ${key}, skipping save.`);
        return;
      }

      return saveToIndexedDB(key, blob); // ✅ Only save non-empty blobs
    });
    const markerPromise = (async () => {
      const markerfile = `markers/${object.marker}`
      console.log("Downloading marker:", object.marker);
      const markerResponse = await fetch(
        `https://e60tr3t3xe.execute-api.ap-south-1.amazonaws.com/dev/?object_name=${object.object_name}&file_name=${markerfile}`
      );

      if (!markerResponse.ok) {
        throw new Error(`Failed to get marker: ${markerResponse.statusText}`);
      }

      const { presignedUrl } = await markerResponse.json();
      console.log("Pre-signed URL received for marker", presignedUrl);

      const markerFileResponse = await fetch(presignedUrl);
      if (!markerFileResponse.ok) {
        throw new Error(`Failed to fetch marker: ${markerFileResponse.statusText}`);
      }

      const markerBlob = await markerFileResponse.blob();

      return saveToIndexedDB("marker", markerBlob); // Save marker
    })();
    toast({title: "files are getting downloaded and prepared"})
    let encodedKeys;
    await Promise.all(downloadPromises); // ✅ Ensure all downloads complete
    await getAllSavedKeys().then((keys)=> {
      console.log("All saved keys:", keys);
      localStorage.setItem("indexedDBKeys", JSON.stringify(keys))// Update only after all are saved
      sessionStorage.setItem("indexedDBKeys", JSON.stringify(keys))
      encodedKeys = encodeURIComponent(JSON.stringify(keys));
    })
    toast({title: "files are downloaded"})
    console.log("All saved keys",localStorage.getItem("indexedDBKeys"))
    console.log("All valid files downloaded and saved successfully!");
    
    setDownloads((prev) => prev + validFiles.length); // ✅ Update only after all are saved
    setTimeout(() => {
      window.location.href = "http://localhost:5500?data=" + encodedKeys;
    },3000)
  } catch (error) {
    console.error("Error downloading files:", error);
  }
  // setDownloads(prev => prev+1)
  // const presignedUrlResponse = await fetch(
  //   `https://e60tr3t3xe.execute-api.ap-south-1.amazonaws.com/dev/?object_name=${object.object_name}&file_name=${markerfile}`,
  //   {
  //     method: "GET",
  //     body: null
  //   }
  // );

  // if (!presignedUrlResponse.ok) {
  //   throw new Error(
  //     `Failed to get pre-signed URL: ${presignedUrlResponse.statusText}`
  //   );
  // }

  // const { presignedUrl } = await presignedUrlResponse.json();
  // console.log("Pre-signed URL received for part", presignedUrl);
  // const fileResponse = await fetch(presignedUrl);
  // const blob = await fileResponse.blob();
  // await saveToIndexedDB("marker", blob)
  
  // const reader = new FileReader();
  // reader.readAsDataURL(blob);
  // reader.onload= () => {
  //   const base64Data = reader.result;
  //   console.log(base64Data);
  //   localStorage.setItem("marker", JSON.stringify({
  //     filename: object.marker,
  //     data:base64Data,
  //   }))
  // if(downloads<= valids){
  //   toast({ title: "All files downloaded successfully" });
  //   setTimeout(() => {
  //     window.location.href = "https://www.google.com";
  //   },3000)}
    
  // else {
  //   toast({ title: "files are downloading" });
  // }
  }
  const getAllSavedKeys = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ModelStorageDB", 1);
  
      request.onsuccess = (event) => {
        const db = (event.target).result;
        const transaction = db.transaction("models", "readonly");
        const store = transaction.objectStore("models");
  
        const keysRequest = store.getAllKeys();
  
        keysRequest.onsuccess = () => {
          console.log("Saved Keys:", keysRequest.result);
          resolve(keysRequest.result);
        };
  
        keysRequest.onerror = () => {
          reject("Failed to retrieve keys from IndexedDB");
        };
      };
  
      request.onerror = () => {
        reject("Failed to open IndexedDB");
      };
    });
  };

  const getModels = async () => {
    try {

      const response = await fetch(
        `https://e60tr3t3xe.execute-api.ap-south-1.amazonaws.com/dev/models`,
        {
        
          method: "GET",
          body: null
        
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to complete upload: ${response.statusText}`);
      }
      
      console.log("Upload completed successfully!");
      console.log(response)
      return response.json()
    } catch (error) {
      console.error("Error in completeUpload:", error);
      throw error;
    }
  };
  const deleteModels = async (id) => {
    try {

      const response = await fetch(
        `https://e60tr3t3xe.execute-api.ap-south-1.amazonaws.com/dev/models`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to complete upload: ${response.statusText}`);
      }
      else{
        setloadingPage(true);
      }
      console.log("Upload completed successfully!");
      console.log(response)
      return response.json()
    } catch (error) {
      console.error("Error in completeUpload:", error);
      throw error;
    }
  };
  useEffect(() => {
    // Load models from localStorage
    // const storedModels = JSON.parse(localStorage.getItem("arModels") || "[]");
    // setModels(storedModels);
    if (load) {
      const loading = async () => {
        const data = await getModels();
        console.log(data);
        setModels(data);
        setloadingPage(false);
    
      }
      loading();
    }
    
  

  
  }, [load]);

  const handleDelete = (id) => {
    const updatedModels = models.filter((model) => model.id !== id);
    setModels(updatedModels);
    localStorage.setItem("arModels", JSON.stringify(updatedModels));
    toast({ title: "Model deleted successfully" });
  };

  const handleDeleteupdated = (id) => {
    const deleteObject = async (ids) => {
      const response = await deleteModels(ids);
      console.log(response)
    }
    deleteObject(id);
    if (load) {
      const loading = async () => {
        const data = await getModels();
        console.log(data);
        setModels(data);
        setloadingPage(false);
      }
      loading()
    }
  
    
    toast({
      title: "Success",
      description: "Model deleted successfully",
    });

  };
  const handleEdit = (model) => {
    navigate("/UploadModels", { state: { editData: model } });
  };

  const filteredModels = models.filter(
    (model) => 
      model.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.object_name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">AR Model List</h2>
        <Button asChild>
          <Link to="/UploadModels">Add New</Link>
        </Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search by model or project name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Model Name</TableHead>
              <TableHead>Marker File</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Audio</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Text</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModels.map((model, index) => (
              <TableRow key={model.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{model.project_name}</TableCell>
                <TableCell>{model.object_name}</TableCell>
                <TableCell>{model.marker}</TableCell>
                <TableCell> {model.file_name.model.map((file, idx) => (
                   
                   <div key={idx}>{file}</div>
                 ))}</TableCell>
                <TableCell> {model.file_name.audio.map((file, idx) => (
                   
                   <div key={idx}>{file}</div>
                 ))}</TableCell>
                <TableCell> {model.file_name.video.map((file, idx) => (
                   
                   <div key={idx}>{file}</div>
                 ))}</TableCell>
                <TableCell> 
                  {model.file_name.text.map((file, idx) => (
                   
                   <div key={idx}>{file}</div>
                 ))}  
                </TableCell>
                <TableCell>{new Date(model.created_on).toLocaleDateString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(model)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteupdated(model.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadFile(model)}
                  >
                    <Eye className="h-4 w-4 text-black" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ModelList;
