import React, { useState, useEffect, useRef } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import db from "../firebase/config";
import { connect } from "react-redux";
import { setAlert } from "../redux/alert/alertActions";
import Loader from "../components/Loader";
import { Editor } from "@tinymce/tinymce-react";

const CreateArticlePage = ({ history, setAlert }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [textContent, setTextContent] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const types = ["image/png", "image/jpeg"];

  const editorRef = useRef(null);

  const changeHandler = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setImage(selected);
    } else {
      setImage("");
      setAlert("Please select an image file (png or jpeg)", "danger");
    }
  };
  const changeCategoryHandler = (e) => {
    setCategory(e.target.value);
    if (e.target.value !== "") {
      const subCat = categories.find(
        (cat) => cat.categoryName === e.target.value
      ).subCategories;
      if (subCat) setSubCategories(subCat);
      else setSubCategories([]);
    } else {
      setSubCategories([]);
      setSubCategory("");
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (
      title &&
      category &&
      subCategory &&
      textContent &&
      image &&
      user &&
      user.email
    ) {
      const storageRef = db.storage().ref(image.name);
      // storageRef.delete()
      const collectionRef = db.firestore().collection("Article");
      storageRef.put(image).on(
        "state_changed",
        (snap) => {
          setLoading(true);
        },
        (err) => {
          setAlert(err, "danger");
        },
        async () => {
          const url = await storageRef.getDownloadURL();
          collectionRef.add({
            title,
            category,
            subCategory,
            textContent,
            image: url,
            createdBy: user.email,
            date: new Date().toDateString(),
            status: "pending_for_review",
          });
          setTitle("");
          setImage("");
          setTextContent("");
          setCategory("");
          setSubCategory("");
          editorRef.current.setContent("");
          setLoading(false);
          setAlert("this post has been added with successfully", "success");
        }
      );
    }
  };

  useEffect(() => {
    const categories = db.firestore().collection("ArticleCategories");
    categories.onSnapshot((snap) => {
      const articleCategories = [];
      snap.forEach((doc) => {
        articleCategories.push({ ...doc.data(), id: doc.id });
      });
      setCategories(articleCategories);
    });
    db.auth().onAuthStateChanged(function (user) {
      if (user && user.emailVerified) {
        setUser(user);
      } else {
        history.push("/");
      }
    });
  }, [history]);

  return (
    <FormContainer>
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group className="mt-2">
          <Form.Label>Article Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Article Catogory</Form.Label>
          <Form.Select value={category} onChange={changeCategoryHandler}>
            <option value="">-- please select Article category --</option>
            {categories.map((item) => (
              <option value={item.categoryName} key={item.id}>
                {item.categoryName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Article Sub Catogory</Form.Label>
          <Form.Select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            disabled={subCategories.length === 0 && true}>
            <option value="">-- please select Article Sub category --</option>
            {subCategories.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Article Image</Form.Label>
          <Form.Control
            type="file"
            className="mb-2"
            placeholder="Enter Article image"
            accept=".png,.jpg,.jpeg"
            onChange={changeHandler}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Article text content</Form.Label>
          <Editor
            apiKey="zqri8re1n8afuojmtdux76spujbjfmtbbxh4tt7a82bechls"
            onInit={(evt, editor) => (editorRef.current = editor)}
            onEditorChange={(newValue, editor) => {
              // setValue(newValue);
              setTextContent(newValue);
            }}
            init={{
              resize: false,
              plugins:
                "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons",
              imagetools_cors_hosts: ["picsum.photos"],
              menubar: "file edit view insert format tools table help",
              toolbar:
                "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
              toolbar_sticky: true,
              autosave_ask_before_unload: true,
              autosave_interval: "30s",
              autosave_prefix: "{path}{query}-{id}-",
              autosave_restore_when_empty: false,
              autosave_retention: "2m",
              image_advtab: true,
              link_list: [
                { title: "My page 1", value: "https://www.tiny.cloud" },
                { title: "My page 2", value: "http://www.moxiecode.com" },
              ],
              image_list: [
                { title: "My page 1", value: "https://www.tiny.cloud" },
                { title: "My page 2", value: "http://www.moxiecode.com" },
              ],
              image_class_list: [
                { title: "None", value: "" },
                { title: "Some class", value: "class-name" },
              ],
              importcss_append: true,
              file_picker_callback: function (callback, value, meta) {
                /* Provide file and text for the link dialog */
                if (meta.filetype === "file") {
                  callback("https://www.google.com/logos/google.jpg", {
                    text: "My text",
                  });
                }
                /* Provide image and alt text for the image dialog */
                if (meta.filetype === "image") {
                  callback("https://www.google.com/logos/google.jpg", {
                    alt: "My alt text",
                  });
                }

                /* Provide alternative source and posted for the media dialog */
                if (meta.filetype === "media") {
                  callback("movie.mp4", {
                    source2: "alt.ogg",
                    poster: "https://www.google.com/logos/google.jpg",
                  });
                }
              },
              templates: [
                {
                  title: "New Table",
                  description: "creates a new table",
                  content:
                    '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
                },
                {
                  title: "Starting my story",
                  description: "A cure for writers block",
                  content: "Once upon a time...",
                },
                {
                  title: "New list with dates",
                  description: "New List with dates",
                  content:
                    '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
                },
              ],
         
              height: 500,
              image_caption: true,
              quickbars_selection_toolbar:
                "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
              noneditable_noneditable_class: "mceNonEditable",
              toolbar_mode: "sliding",
              contextmenu: "link image imagetools table",
          
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" className="mt-2" size="sm" type="submit">
            Add article
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAlert: (content, type) => dispatch(setAlert(content, type)),
  };
};
export default connect(null, mapDispatchToProps)(CreateArticlePage);
