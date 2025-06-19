import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useProblemStore } from "../../hooks/useStore";
import HorizontalSelect from "../ui/select";
import { CloseIcon, Menuunfold } from "../ui/icons";
import ButtonGroup from "../ui/buttons";
import FormInput from "../ui/textInput";
import ImagePickerComponent from "../ui/imageInput";
// constants
const difficultyLevels = ["easy", "medium", "hard"];

export default function ModalForm({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("DSA");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // DSA form data
  const [dsaData, setDsaData] = useState<any>({
    topicId: "",
    title: "",
    description: "",
    difficultyLevel: "easy",
    explanation: "",
    problemLink: "",
    testCase: "",
    code: "",
    similarProblems: [],
    images: [], // Add this
  });
  const [newSimilar, setNewSimilar] = useState<any>({
    title: "",
    description: "",
    shortExplanation: "",
    difficultyLevel: "easy",
    code: "",
  });

  // System Design form data
  const [systemDesignData, setSystemDesignData] = useState({
    title: "",
    description: "",
    explanation: "",
    difficultyLevel: "easy",
    images: [], // Add this
  });
  // Interview form data
  const [interviewData, setInterviewData] = useState({
    title: "",
    description: "",
    explanation: "",
    difficultyLevel: "easy",
    images: [], // Add this
  });
  // Core Concepts form data
  const [coreConceptsData, setCoreConceptsData] = useState({
    title: "",
    description: "",
    explanation: "",
    difficultyLevel: "easy",
    images: [], // Add this
  });

  const topics = useProblemStore((s) => s.topics);
  const addProblem = useProblemStore((s) => s.addProblem);

  const validateDSAForm = () => {
    const newErrors: Record<string, string> = {};

    if (!dsaData.topicId) newErrors.topicId = "Topic is required";
    if (!dsaData.title.trim()) newErrors.title = "Title is required";
    if (!dsaData.description.trim())
      newErrors.description = "Description is required";
    if (!dsaData.explanation.trim())
      newErrors.explanation = "Explanation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSystemDesignForm = () => {
    const newErrors: Record<string, string> = {};

    if (!systemDesignData.title.trim()) newErrors.title = "Title is required";
    if (!systemDesignData.description.trim())
      newErrors.description = "Description is required";
    if (!systemDesignData.explanation.trim())
      newErrors.explanation = "Explanation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInterviewForm = () => {
    const newErrors: Record<string, string> = {};

    if (!interviewData.title.trim()) newErrors.title = "Title is required";
    if (!interviewData.description.trim())
      newErrors.description = "Description is required";
    if (!interviewData.explanation.trim())
      newErrors.explanation = "Explanation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCoreConceptsForm = () => {
    const newErrors: Record<string, string> = {};

    if (!coreConceptsData.title.trim()) newErrors.title = "Title is required";
    if (!coreConceptsData.description.trim())
      newErrors.description = "Description is required";
    if (!coreConceptsData.explanation.trim())
      newErrors.explanation = "Explanation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSimilar = () => {
    if (!newSimilar.title.trim()) {
      Alert.alert("Error", "Similar problem title is required");
      return;
    }
    if (!newSimilar.description.trim()) {
      Alert.alert("Error", "Similar problem description is required");
      return;
    }
    if (!newSimilar.shortExplanation.trim()) {
      Alert.alert("Error", "Similar problem explanation is required");
      return;
    }

    setDsaData({
      ...dsaData,
      similarProblems: [...dsaData.similarProblems, newSimilar],
    });
    setNewSimilar({
      title: "",
      description: "",
      shortExplanation: "",
      difficultyLevel: "easy",
      code: "",
    });
  };

  const handleSave = () => {
    let isValid = false;
    let problemData: any = {};

    switch (selectedCategory) {
      case "DSA":
        isValid = validateDSAForm();
        if (isValid) {
          problemData = {
            ...dsaData,
            id: Date.now().toString(),
          };
        }
        break;
      case "System Design":
        isValid = validateSystemDesignForm();
        if (isValid) {
          problemData = {
            id: Date.now().toString(),
            topicId: "system-design", // Default topic for now
            title: systemDesignData.title,
            description: systemDesignData.description,
            explanation: systemDesignData.explanation,
            difficultyLevel: systemDesignData.difficultyLevel,
          };
        }
        break;
      case "Interview":
        isValid = validateInterviewForm();
        if (isValid) {
          problemData = {
            id: Date.now().toString(),
            topicId: "interview", // Default topic for now
            title: interviewData.title,
            description: interviewData.description,
            explanation: interviewData.explanation,
            difficultyLevel: interviewData.difficultyLevel,
          };
        }
        break;
      case "Core Concepts":
        isValid = validateCoreConceptsForm();
        if (isValid) {
          problemData = {
            id: Date.now().toString(),
            topicId: "core-concepts", // Default topic for now
            title: coreConceptsData.title,
            description: coreConceptsData.description,
            explanation: coreConceptsData.explanation,
            difficultyLevel: coreConceptsData.difficultyLevel,
          };
        }
        break;
    }

    if (isValid) {
      addProblem(problemData);
      resetAll();
    }
  };

  const resetAll = () => {
    setSelectedCategory("DSA");

    setErrors({});
    setDsaData({
      topicId: "",
      title: "",
      description: "",
      difficultyLevel: "easy",
      explanation: "",
      problemLink: "",
      testCase: "",
      code: "",
      similarProblems: [],
      images: [],
    });
    setNewSimilar({
      title: "",
      description: "",
      shortExplanation: "",
      difficultyLevel: "easy",
      code: "",
    });
    setSystemDesignData({
      title: "",
      description: "",
      explanation: "",
      difficultyLevel: "easy",
    });
    setInterviewData({
      title: "",
      description: "",
      explanation: "",
      difficultyLevel: "easy",
    });
    setCoreConceptsData({
      title: "",
      description: "",
      explanation: "",
      difficultyLevel: "easy",
    });
    onClose();
  };

  const renderError = (fieldName: string) => {
    if (errors[fieldName]) {
      return <Text style={styles.errorText}>{errors[fieldName]}</Text>;
    }
    return null;
  };

  const renderDSAForm = () => (
    <>
      {/* Topic Selection */}
      <HorizontalSelect
        label="Topic"
        data={topics.map((topic) => topic.title)}
        onSelect={(selectedTitle) => {
          const selectedTopic = topics.find(
            (topic) => topic.title === selectedTitle,
          );
          if (selectedTopic) {
            setDsaData({ ...dsaData, topicId: selectedTopic.id });
            if (errors.topicId) {
              setErrors({ ...errors, topicId: "" });
            }
          }
        }}
        defaultSelected={topics.length > 0 ? topics[0].title : "Two Pointers"} // Use actual topic title as default
        borderRadius={10}
      />
      {renderError("topicId")}

      <FormInput
        label="Problem Title"
        value={dsaData.title}
        onChangeText={(text) => {
          setDsaData({ ...dsaData, title: text });
          if (errors.title) setErrors({ ...errors, title: "" });
        }}
        placeholder="Enter problem title"
        mandatory={true}
        error={errors.title}
      />

      <FormInput
        label="Description"
        value={dsaData.description}
        onChangeText={(text) => {
          setDsaData({ ...dsaData, description: text });
          if (errors.description) setErrors({ ...errors, description: "" });
        }}
        placeholder="Enter problem description"
        multiline={true}
        mandatory={true}
        error={errors.description}
      />

      <HorizontalSelect
        label="Difficulty Level"
        data={difficultyLevels}
        onSelect={(selectedDifficulty) => {
          setDsaData({ ...dsaData, difficultyLevel: selectedDifficulty });
          if (errors.difficultyLevel) {
            setErrors({ ...errors, difficultyLevel: "" });
          }
        }}
        defaultSelected="easy"
        borderRadius={10}
      />
      {errors.difficultyLevel && (
        <Text style={styles.errorText}>{errors.difficultyLevel}</Text>
      )}

      <FormInput
        label="Problem Link"
        value={dsaData.problemLink}
        onChangeText={(text) => setDsaData({ ...dsaData, problemLink: text })}
        placeholder="https://leetcode.com/problems/..."
        mandatory={false}
      />

      <FormInput
        label="Test Case"
        value={dsaData.testCase}
        onChangeText={(text) => setDsaData({ ...dsaData, testCase: text })}
        placeholder="Input: [1,2,3]&#10;Output: 6&#10;Explanation: Sum of array elements"
        multiline={true}
        mandatory={false}
      />

      <FormInput
        label="Explanation"
        value={dsaData.explanation}
        onChangeText={(text) => {
          setDsaData({ ...dsaData, explanation: text });
          if (errors.explanation) setErrors({ ...errors, explanation: "" });
        }}
        placeholder="Detailed explanation of the approach and solution"
        multiline={true}
        mandatory={true}
        error={errors.explanation}
      />

      {/* Add Image Picker */}
      <ImagePickerComponent
        images={dsaData.images}
        onImagesChange={(images) => setDsaData({ ...dsaData, images })}
        maxImages={4}
      />

      <FormInput
        label="Code"
        value={dsaData.code}
        onChangeText={(text) => setDsaData({ ...dsaData, code: text })}
        placeholder="def solution(nums):&#10;    # Your code here&#10;    return result"
        multiline={true}
        mandatory={false}
        fontFamily="monospace"
      />

      <Text style={styles.label}>Add Similar Problem (Optional)</Text>

      {dsaData.similarProblems.length > 0 && (
        <HorizontalSelect
          data={dsaData.similarProblems.map((problem) => problem.title)}
          onSelect={() => {}}
          defaultSelected=""
          borderRadius={10}
        />
      )}

      <FormInput
        label="Title"
        value={newSimilar.title}
        onChangeText={(text) => setNewSimilar({ ...newSimilar, title: text })}
        placeholder="Similar problem title"
        mandatory={false}
      />

      <FormInput
        label="Description"
        value={newSimilar.description}
        onChangeText={(text) =>
          setNewSimilar({ ...newSimilar, description: text })
        }
        placeholder="Brief description"
        multiline={true}
        mandatory={false}
      />

      <FormInput
        label="Short Explanation"
        value={newSimilar.shortExplanation}
        onChangeText={(text) =>
          setNewSimilar({ ...newSimilar, shortExplanation: text })
        }
        placeholder="Key differences or approach"
        multiline={true}
        mandatory={false}
      />

      <HorizontalSelect
        label="Difficulty Level"
        data={difficultyLevels}
        onSelect={(selectedDifficulty) => {
          setNewSimilar({ ...newSimilar, difficultyLevel: selectedDifficulty });
        }}
        defaultSelected="easy"
        borderRadius={10}
      />

      <FormInput
        label="Code"
        value={newSimilar.code}
        onChangeText={(text) => setNewSimilar({ ...newSimilar, code: text })}
        placeholder="Solution code"
        multiline={true}
        mandatory={false}
        fontFamily="monospace"
      />

      <ButtonGroup
        text1="+ Add Similar Problem"
        handlePress1={handleAddSimilar}
      />
    </>
  );

  const renderSystemDesignForm = () => (
    <>
      <Text style={styles.label}>System Design Title *</Text>
      <TextInput
        style={[styles.inputSmall, errors.title && styles.inputError]}
        placeholder="e.g., Design a URL Shortener"
        value={systemDesignData.title}
        onChangeText={(text) => {
          setSystemDesignData({ ...systemDesignData, title: text });
          if (errors.title) setErrors({ ...errors, title: "" });
        }}
      />
      {renderError("title")}

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.inputMedium, errors.description && styles.inputError]}
        placeholder="Describe the system requirements and constraints"
        multiline
        textAlignVertical="top"
        returnKeyType="default"
        value={systemDesignData.description}
        onChangeText={(text) => {
          setSystemDesignData({ ...systemDesignData, description: text });
          if (errors.description) setErrors({ ...errors, description: "" });
        }}
      />
      {renderError("description")}

      <Text style={styles.label}>Solution & Explanation *</Text>
      <TextInput
        style={[styles.inputCode, errors.explanation && styles.inputError]}
        placeholder="Detailed system design approach, architecture, components, etc."
        multiline
        textAlignVertical="top"
        returnKeyType="default"
        value={systemDesignData.explanation}
        onChangeText={(text) => {
          setSystemDesignData({ ...systemDesignData, explanation: text });
          if (errors.explanation) setErrors({ ...errors, explanation: "" });
        }}
      />
      {renderError("explanation")}

      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonText}>
          🚧 More fields coming soon: Architecture diagrams, scalability
          considerations, trade-offs analysis
        </Text>
      </View>
    </>
  );

  const renderInterviewForm = () => (
    <>
      <Text style={styles.label}>Interview Question *</Text>
      <TextInput
        style={[styles.inputSmall, errors.title && styles.inputError]}
        placeholder="e.g., Tell me about yourself"
        value={interviewData.title}
        onChangeText={(text) => {
          setInterviewData({ ...interviewData, title: text });
          if (errors.title) setErrors({ ...errors, title: "" });
        }}
      />
      {renderError("title")}

      <Text style={styles.label}>Context & Details *</Text>
      <TextInput
        style={[styles.inputMedium, errors.description && styles.inputError]}
        placeholder="Provide context about when this question is asked, what the interviewer is looking for"
        multiline
        textAlignVertical="top"
        returnKeyType="default"
        value={interviewData.description}
        onChangeText={(text) => {
          setInterviewData({ ...interviewData, description: text });
          if (errors.description) setErrors({ ...errors, description: "" });
        }}
      />
      {renderError("description")}

      <Text style={styles.label}>Sample Answer & Tips *</Text>
      <TextInput
        style={[styles.inputCode, errors.explanation && styles.inputError]}
        placeholder="Provide a sample answer and tips on how to approach this question"
        multiline
        textAlignVertical="top"
        returnKeyType="default"
        value={interviewData.explanation}
        onChangeText={(text) => {
          setInterviewData({ ...interviewData, explanation: text });
          if (errors.explanation) setErrors({ ...errors, explanation: "" });
        }}
      />
      {renderError("explanation")}

      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonText}>
          🚧 More fields coming soon: Question categories, follow-up questions,
          interviewer tips
        </Text>
      </View>
    </>
  );

  const renderCoreConceptsForm = () => (
    <>
      <Text style={styles.label}>Concept Title *</Text>
      <TextInput
        style={[styles.inputSmall, errors.title && styles.inputError]}
        placeholder="e.g., Object-Oriented Programming"
        value={coreConceptsData.title}
        onChangeText={(text) => {
          setCoreConceptsData({ ...coreConceptsData, title: text });
          if (errors.title) setErrors({ ...errors, title: "" });
        }}
      />
      {renderError("title")}

      <Text style={styles.label}>Overview *</Text>
      <TextInput
        style={[styles.inputMedium, errors.description && styles.inputError]}
        placeholder="Brief overview of the concept"
        multiline
        textAlignVertical="top"
        returnKeyType="default"
        value={coreConceptsData.description}
        onChangeText={(text) => {
          setCoreConceptsData({ ...coreConceptsData, description: text });
          if (errors.description) setErrors({ ...errors, description: "" });
        }}
      />
      {renderError("description")}

      <Text style={styles.label}>Detailed Explanation *</Text>
      <TextInput
        style={[styles.inputCode, errors.explanation && styles.inputError]}
        placeholder="Detailed explanation with examples, use cases, and key points"
        multiline
        textAlignVertical="top"
        returnKeyType="default"
        value={coreConceptsData.explanation}
        onChangeText={(text) => {
          setCoreConceptsData({ ...coreConceptsData, explanation: text });
          if (errors.explanation) setErrors({ ...errors, explanation: "" });
        }}
      />
      {renderError("explanation")}

      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonText}>
          🚧 More fields coming soon: Related concepts, practical examples,
          references
        </Text>
      </View>
    </>
  );

  const renderCurrentForm = () => {
    switch (selectedCategory) {
      case "DSA":
        return renderDSAForm();
      case "System Design":
        return renderSystemDesignForm();
      case "Interview":
        return renderInterviewForm();
      case "Core Concepts":
        return renderCoreConceptsForm();
      default:
        return renderDSAForm();
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <View style={styles.heading}>
            <Menuunfold />
            <Text style={styles.headerTitle}>Create New</Text>
          </View>
          <CloseIcon onPress={resetAll} />
        </View>

        {/* Category Selection */}
        <View style={styles.scrollContent}>
          <HorizontalSelect
            label="Category"
            data={["DSA", "Core Concepts", "System Design", "Interview"]}
            onSelect={(item) => {
              setSelectedCategory(item);
              setErrors({});
            }}
            defaultSelected="DSA"
            borderRadius={10}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderCurrentForm()}

          <ButtonGroup
            text1="Save"
            handlePress1={handleSave}
            text2="Cancel"
            handlePress2={resetAll}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "500",
    color: "#212529",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  categoryListContent: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  categoryTabSelected: {
    backgroundColor: "#4f46e5",
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  categoryTabTextSelected: {
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#495057",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#dee2e6",
    marginVertical: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
    color: "#495057",
  },
  topicList: {
    marginBottom: 10,
  },
  topicListContent: {
    paddingRight: 20,
  },
  topicItem: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  topicItemSelected: {
    backgroundColor: "#007bff",
  },
  topicItemError: {
    borderColor: "#dc3545",
  },
  topicText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057",
    textAlign: "center",
  },
  topicTextSelected: {
    color: "#fff",
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    height: 48,
  },
  inputMedium: {
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    height: 100,
  },
  inputLarge: {
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    height: 150,
  },
  inputCode: {
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    height: 200,
    fontFamily: "monospace",
  },
  inputError: {
    borderColor: "#dc3545",
    borderWidth: 2,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  dropdownContainer: {
    position: "relative",
    zIndex: 1000,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    height: 48,
  },
  dropdownText: {
    fontSize: 16,
    color: "#495057",
    textTransform: "capitalize",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6c757d",
  },
  dropdownOptions: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  dropdownOptionSelected: {
    backgroundColor: "#e3f2fd",
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#495057",
    textTransform: "capitalize",
  },
  dropdownOptionTextSelected: {
    color: "#1976d2",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  similarProblemsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  similarProblemItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 8,
  },
  similarProblemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057",
    flex: 1,
  },
  similarProblemDifficulty: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6c757d",
    textTransform: "capitalize",
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  comingSoonContainer: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeaa7",
    marginTop: 20,
  },
  comingSoonText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
    fontStyle: "italic",
  },
});
