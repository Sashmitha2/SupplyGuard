import { useEffect, useState } from "react";

import {
  getDisruptions,
  createDisruption,
  updateDisruption,
  deleteDisruption,
} from "../services/api";

import CrudModal from "../components/CRUDModal";
import DeleteModal from "../components/DeleteModal";

function Disruptions() {

  // =========================
  // DATA
  // =========================

  const [disruptions, setDisruptions] =
    useState([]);

  // =========================
  // SEARCH + FILTER
  // =========================

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // =========================
  // ADD / EDIT
  // =========================

  const [showForm, setShowForm] =
    useState(false);

  const [editingDisruption, setEditingDisruption] =
    useState(null);

  // =========================
  // DELETE
  // =========================

  const [deletingDisruption, setDeletingDisruption] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  // =========================
  // LOADING / SAVING
  // =========================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] =
    useState({
      disruptionId: "",
      type: "",
      severity: "MEDIUM",
      region: "",
      supplierId: "",
      materialId: "",
      startDate: "",
      expectedEndDate: "",
      status: "MONITORING",
      description: "",
    });

  // =====================================================
  // LOAD DISRUPTIONS
  // =====================================================

  const loadDisruptions = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getDisruptions();

      setDisruptions(
        response.data
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to load disruptions."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadDisruptions();
  }, []);

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAdd = () => {

    setEditingDisruption(null);

    setFormData({
      disruptionId: "",
      type: "",
      severity: "MEDIUM",
      region: "",
      supplierId: "",
      materialId: "",
      startDate: "",
      expectedEndDate: "",
      status: "MONITORING",
      description: "",
    });

    setShowForm(true);
    setError("");
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (
    disruption
  ) => {

    setEditingDisruption(
      disruption
    );

    setFormData({

      disruptionId:
        disruption.disruptionId ||
        "",

      type:
        disruption.type || "",

      severity:
        disruption.severity ||
        "MEDIUM",

      region:
        disruption.region || "",

      supplierId:
        disruption.supplierId ||
        "",

      materialId:
        disruption.materialId ||
        "",

      startDate:
        disruption.startDate
          ? disruption.startDate.substring(
              0,
              10
            )
          : "",

      expectedEndDate:
        disruption.expectedEndDate
          ? disruption.expectedEndDate.substring(
              0,
              10
            )
          : "",

      status:
        disruption.status ||
        "MONITORING",

      description:
        disruption.description ||
        "",
    });

    setShowForm(true);
    setError("");
  };

  // =====================================================
  // SAVE DISRUPTION
  // =====================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    try {

      setSaving(true);
      setError("");

      const data = {

        disruptionId:
          formData.disruptionId,

        type:
          formData.type,

        severity:
          formData.severity,

        region:
          formData.region,

        supplierId:
          formData.supplierId,

        materialId:
          formData.materialId,

        startDate:
          formData.startDate,

        expectedEndDate:
          formData.expectedEndDate,

        status:
          formData.status,

        description:
          formData.description,
      };

      // EDIT
      if (editingDisruption) {

        await updateDisruption(
          editingDisruption._id,
          data
        );

      }

      // ADD
      else {

        await createDisruption(
          data
        );

      }

      // Close modal
      setShowForm(false);

      setEditingDisruption(
        null
      );

      // Reload table
      await loadDisruptions();

    } catch (error) {

      console.error(error);

      if (
        error.response?.data?.message
      ) {

        setError(
          error.response.data.message
        );

      } else {

        setError(
          "Failed to save disruption."
        );

      }

    } finally {

      setSaving(false);

    }
  };

  // =====================================================
  // OPEN DELETE MODAL
  // =====================================================

  const handleDelete = (
    disruption
  ) => {

    setDeletingDisruption(
      disruption
    );
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDelete = async () => {

    if (!deletingDisruption) {
      return;
    }

    try {

      setDeleting(true);
      setError("");

      await deleteDisruption(
        deletingDisruption._id
      );

      // Close delete modal
      setDeletingDisruption(
        null
      );

      // Reload table
      await loadDisruptions();

    } catch (error) {

      console.error(error);

      if (
        error.response?.data?.message
      ) {

        setError(
          error.response.data.message
        );

      } else {

        setError(
          "Failed to delete disruption."
        );

      }

    } finally {

      setDeleting(false);

    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredDisruptions =
    disruptions.filter(
      (disruption) => {

        const searchText =
          search.toLowerCase();

        const matchesSearch =
          disruption.disruptionId
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          disruption.type
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          disruption.region
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          disruption.supplierId
            ?.toLowerCase()
            .includes(
              searchText
            ) ||

          disruption.materialId
            ?.toLowerCase()
            .includes(
              searchText
            );

        const matchesStatus =
          statusFilter === "ALL" ||
          disruption.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="page">

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (

        <CrudModal

          title={
            editingDisruption
              ? "Edit Disruption"
              : "Add New Disruption"
          }

          onClose={() => {

            setShowForm(false);

            setEditingDisruption(
              null
            );

          }}

          onSubmit={
            handleSubmit
          }

          submitText={
            editingDisruption
              ? "Update Disruption"
              : "Create Disruption"
          }

          saving={saving}
        >

          <div className="form-grid">

            {/* DISRUPTION ID */}

            <div className="form-group">

              <label>
                Disruption ID
              </label>

              <input
                type="text"
                name="disruptionId"
                value={
                  formData.disruptionId
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. DIS101"
                required
                disabled={
                  Boolean(
                    editingDisruption
                  )
                }
              />

            </div>

            {/* TYPE */}

            <div className="form-group">

              <label>
                Disruption Type
              </label>

              <input
                type="text"
                name="type"
                value={
                  formData.type
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Transport Delay"
                required
              />

            </div>

            {/* SEVERITY */}

            <div className="form-group">

              <label>
                Severity
              </label>

              <select
                name="severity"
                value={
                  formData.severity
                }
                onChange={
                  handleChange
                }
                required
              >

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>

                <option value="CRITICAL">
                  CRITICAL
                </option>

              </select>

            </div>

            {/* REGION */}

            <div className="form-group">

              <label>
                Region
              </label>

              <input
                type="text"
                name="region"
                value={
                  formData.region
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Colombo"
                required
              />

            </div>

            {/* SUPPLIER ID */}

            <div className="form-group">

              <label>
                Supplier ID
              </label>

              <input
                type="text"
                name="supplierId"
                value={
                  formData.supplierId
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. SUP001"
                required
              />

            </div>

            {/* MATERIAL ID */}

            <div className="form-group">

              <label>
                Material ID
              </label>

              <input
                type="text"
                name="materialId"
                value={
                  formData.materialId
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. MAT001"
                required
              />

            </div>

            {/* START DATE */}

            <div className="form-group">

              <label>
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={
                  formData.startDate
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* EXPECTED END */}

            <div className="form-group">

              <label>
                Expected End Date
              </label>

              <input
                type="date"
                name="expectedEndDate"
                value={
                  formData.expectedEndDate
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* STATUS */}

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
                required
              >

                <option value="ACTIVE">
                  ACTIVE
                </option>

                <option value="MONITORING">
                  MONITORING
                </option>

                <option value="RESOLVED">
                  RESOLVED
                </option>

              </select>

            </div>

            {/* DESCRIPTION */}

            <div
              className="form-group"
              style={{
                gridColumn:
                  "1 / -1",
              }}
            >

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Describe the disruption..."
                rows="4"
              />

            </div>

          </div>

        </CrudModal>

      )}

      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {deletingDisruption && (

        <DeleteModal

          itemName={
            deletingDisruption.disruptionId
          }

          onCancel={() =>
            setDeletingDisruption(
              null
            )
          }

          onConfirm={
            confirmDelete
          }

          deleting={deleting}

        />

      )}

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <h1>
            Disruptions
          </h1>

          <p>
            Manage supply disruptions
            and monitor their status.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={handleAdd}
        >
          + Add Disruption
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search disruptions..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="filter-select"
        >

          <option value="ALL">
            All Statuses
          </option>

          <option value="ACTIVE">
            ACTIVE
          </option>

          <option value="MONITORING">
            MONITORING
          </option>

          <option value="RESOLVED">
            RESOLVED
          </option>

        </select>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="table-card">

        {loading ? (

          <div className="loading">
            Loading disruptions...
          </div>

        ) : filteredDisruptions.length ===
          0 ? (

          <div className="empty-state">
            No disruptions found.
          </div>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Severity
                  </th>

                  <th>
                    Region
                  </th>

                  <th>
                    Supplier
                  </th>

                  <th>
                    Material
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Expected End
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredDisruptions.map(
                  (disruption) => (

                    <tr
                      key={
                        disruption._id
                      }
                    >

                      <td>
                        {
                          disruption.disruptionId
                        }
                      </td>

                      <td>
                        {
                          disruption.type
                        }
                      </td>

                      <td>
                        {
                          disruption.severity
                        }
                      </td>

                      <td>
                        {
                          disruption.region
                        }
                      </td>

                      <td>
                        {
                          disruption.supplierId
                        }
                      </td>

                      <td>
                        {
                          disruption.materialId
                        }
                      </td>

                      <td>
                        {
                          disruption.status
                        }
                      </td>

                      <td>

                        {disruption.expectedEndDate
                          ? new Date(
                              disruption.expectedEndDate
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              handleEdit(
                                disruption
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                disruption
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );
}

export default Disruptions;