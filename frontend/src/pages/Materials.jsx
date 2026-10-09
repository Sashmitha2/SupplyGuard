import { useEffect, useState } from "react";

import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../services/api";

import RiskBadge from "../components/RiskBadge";
import CrudModal from "../components/CRUDModal";
import DeleteModal from "../components/DeleteModal";

function Materials() {
  const [materials, setMaterials] = useState([]);

  const [search, setSearch] = useState("");
  const [criticalityFilter, setCriticalityFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deletingMaterial, setDeletingMaterial] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    materialId: "",
    materialName: "",
    category: "",
    unit: "",
    currentStock: "",
    safetyStock: "",
    dailyConsumption: "",
    criticality: "MEDIUM",
    supplierId: "",
  });

  // =========================
  // LOAD MATERIALS
  // =========================

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMaterials();

      setMaterials(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const handleAdd = () => {
    setEditingMaterial(null);

    setFormData({
      materialId: "",
      materialName: "",
      category: "",
      unit: "",
      currentStock: "",
      safetyStock: "",
      dailyConsumption: "",
      criticality: "MEDIUM",
      supplierId: "",
    });

    setShowForm(true);
    setError("");
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const handleEdit = (material) => {
    setEditingMaterial(material);

    setFormData({
      materialId: material.materialId || "",
      materialName: material.materialName || "",
      category: material.category || "",
      unit: material.unit || "",
      currentStock: material.currentStock ?? "",
      safetyStock: material.safetyStock ?? "",
      dailyConsumption: material.dailyConsumption ?? "",
      criticality: material.criticality || "MEDIUM",
      supplierId: material.supplierId || "",
    });

    setShowForm(true);
    setError("");
  };

  // =========================
  // SAVE MATERIAL
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        materialId: formData.materialId,
        materialName: formData.materialName,
        category: formData.category,
        unit: formData.unit,
        currentStock: Number(formData.currentStock),
        safetyStock: Number(formData.safetyStock),
        dailyConsumption: Number(formData.dailyConsumption),
        criticality: formData.criticality,
        supplierId: formData.supplierId,
      };

      if (editingMaterial) {
        await updateMaterial(editingMaterial._id, data);
      } else {
        await createMaterial(data);
      }

      setShowForm(false);
      setEditingMaterial(null);

      await loadMaterials();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to save material.");
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE MATERIAL
  // =========================

  const handleDelete = (material) => {
  setDeletingMaterial(material);
};

const confirmDelete = async () => {
  if (!deletingMaterial) {
    return;
  }

  try {
    setDeleting(true);
    setError("");

    await deleteMaterial(deletingMaterial._id);

    setDeletingMaterial(null);

    await loadMaterials();
  } catch (error) {
    console.error(error);
    setError("Failed to delete material.");
  } finally {
    setDeleting(false);
  }
};

  // =========================
  // FILTER MATERIALS
  // =========================

  const filteredMaterials = materials.filter((material) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      material.materialName?.toLowerCase().includes(searchText) ||
      material.materialId?.toLowerCase().includes(searchText) ||
      material.category?.toLowerCase().includes(searchText);

    const matchesCriticality =
      criticalityFilter === "ALL" ||
      material.criticality === criticalityFilter;

    return matchesSearch && matchesCriticality;
  });

  return (
    <div className="page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">
        {showForm && (
  <CrudModal
    title={
      editingMaterial
        ? "Edit Material"
        : "Add New Material"
    }
    onClose={() => {
      setShowForm(false);
      setEditingMaterial(null);
    }}
    onSubmit={handleSubmit}
    submitText={
      editingMaterial
        ? "Update Material"
        : "Create Material"
    }
    saving={saving}
  >
    <div className="form-grid">

      <div className="form-group">
        <label>Material ID</label>

        <input
          type="text"
          name="materialId"
          value={formData.materialId}
          onChange={handleChange}
          placeholder="e.g. MAT101"
          required
          disabled={Boolean(editingMaterial)}
        />
      </div>

      <div className="form-group">
        <label>Material Name</label>

        <input
          type="text"
          name="materialName"
          value={formData.materialName}
          onChange={handleChange}
          placeholder="e.g. Natural Rubber"
          required
        />
      </div>

      <div className="form-group">
        <label>Category</label>

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. Rubber"
          required
        />
      </div>

      <div className="form-group">
        <label>Unit</label>

        <input
          type="text"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          placeholder="e.g. kg"
          required
        />
      </div>

      <div className="form-group">
        <label>Current Stock</label>

        <input
          type="number"
          name="currentStock"
          value={formData.currentStock}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>Safety Stock</label>

        <input
          type="number"
          name="safetyStock"
          value={formData.safetyStock}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>Daily Consumption</label>

        <input
          type="number"
          name="dailyConsumption"
          value={formData.dailyConsumption}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Criticality</label>

        <select
          name="criticality"
          value={formData.criticality}
          onChange={handleChange}
          required
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
      </div>

      <div className="form-group">
        <label>Supplier ID</label>

        <input
          type="text"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          placeholder="e.g. SUP001"
          required
        />
      </div>

    </div>
  </CrudModal>
)}
        <div>
          <h1>Materials</h1>
          <p>
            Manage raw materials and monitor inventory information.
          </p>
        </div>

        <button className="primary-button" onClick={handleAdd}>
          + Add Material
        </button>
      </div>

      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =========================
          ADD / EDIT FORM
      ========================= */}

      

      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search materials..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="search-input"
        />

        <select
          value={criticalityFilter}
          onChange={(event) =>
            setCriticalityFilter(event.target.value)
          }
          className="filter-select"
        >
          <option value="ALL">All Criticality</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

      </div>

      {/* =========================
          MATERIAL TABLE
      ========================= */}

      <div className="table-card">

        {loading ? (
          <div className="loading">
            Loading materials...
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="empty-state">
            No materials found.
          </div>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Material</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Safety Stock</th>
                  <th>Daily Consumption</th>
                  <th>Material Class</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredMaterials.map((material) => (
                  <tr key={material._id}>

                    <td>
                      {material.materialId}
                    </td>

                    <td>
                      <strong>
                        {material.materialName}
                      </strong>
                    </td>

                    <td>
                      {material.category}
                    </td>

                    <td>
                      {material.currentStock}{" "}
                      {material.unit}
                    </td>

                    <td>
                      {material.safetyStock}{" "}
                      {material.unit}
                    </td>

                    <td>
                      {material.dailyConsumption}{" "}
                      {material.unit}/day
                    </td>

                    <td>
                      <RiskBadge
                        level={material.criticality}
                      />
                    </td>

                    <td>
                      {material.supplierId}
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(material)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(material)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================= */}

      {deletingMaterial && (
        <DeleteModal
          itemName={deletingMaterial.materialName}
          onCancel={() => setDeletingMaterial(null)}
          onConfirm={confirmDelete}
          deleting={deleting}
        />
      )}


    </div>
  );
}

export default Materials;