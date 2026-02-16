const { useState, useEffect, useRef } = React;

// --- Components ---

const TemplateList = ({ onSelectTemplate, onNewTemplate }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await axios.get('/templates');
            setTemplates(res.data);
        } catch (error) {
            console.error("Error fetching templates:", error);
            alert("Error cargando templates");
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (template) => {
        // En una app real, pediríamos datos de prueba. Aquí usaremos un objeto vacío o datos dummy.
        const dummyData = { name: "Juan Perez", date: "2023-01-01", amount: "100.00" };
        try {
            const res = await axios.post('/generate', {
                templateName: template.name,
                data: dummyData
            }, { responseType: 'blob' }); // Importante: blob para PDF

            const url = window.URL.createObjectURL(new Blob([res.data]));
            window.open(url, '_blank');
        } catch (err) {
            console.error(err);
            alert("Error generando preview");
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Mis Templates PDF</h2>
                <button className="btn btn-primary" onClick={onNewTemplate}>
                    <i className="fas fa-plus me-2"></i>Nueva Template
                </button>
            </div>

            {loading ? (
                <div className="text-center"><div className="spinner-border text-primary"></div></div>
            ) : (
                <div className="row">
                    {templates.map(t => (
                        <div key={t.id} className="col-md-4 mb-3">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{t.name}</h5>
                                    <p className="card-text text-muted small">ID: {t.id}</p>
                                    <p className="card-text text-muted small">Creado: {new Date(t.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="card-footer bg-white border-top-0 d-flex justify-content-between">
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handlePreview(t)}>
                                        <i className="fas fa-eye me-1"></i> Preview
                                    </button>
                                    <button className="btn btn-outline-primary btn-sm" onClick={() => onSelectTemplate(t)}>
                                        <i className="fas fa-edit me-1"></i> Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {templates.length === 0 && <p className="text-center text-muted">No hay templates creadas.</p>}
                </div>
            )}
        </div>
    );
};

const TemplateEditor = ({ template, onBack, onSave }) => {
    // Estado inicial de la template
    const [name, setName] = useState(template ? template.name : "");
    const [objects, setObjects] = useState(template ? template.template_json.objects : []);
    const [selectedId, setSelectedId] = useState(null);
    const [dragId, setDragId] = useState(null);

    // Canvas ref para calcular posiciones relativas
    const canvasRef = useRef(null);

    // Añadir nuevo elemento texto
    const addText = () => {
        const newObj = {
            id: Date.now(), // simple ID
            type: 'text',
            x: 50,
            y: 750, // Coordenadas PDF (0,0 es abajo-izquierda usualmente en PDF-Lib, pero visualmente lo manejaremos como top-left y luego convertiremos si hace falta, o asumimos sistema de coordenadas de PDF-Lib y mostramos invertido? 
            // PDF-Lib: (0,0) is bottom-left.
            // HTML/Canvas: (0,0) is top-left.
            // Para simplificar, en el backend ya se usa x,y directos. 
            // Si el backend usa pdf-lib directo, 0,0 es bottom-left.
            // Vamos a simular un canvas de A4: 595 x 842.
            // Si en el visualizador ponemos (0,0) arriba-izquierda, al guardar tendremos que invertir Y.
            // Ojo: el código original del usuario usaba: y: 750 para estar "arriba". 
            // 842 (alto total) - 750 = 92px desde abajo.
            // Así que visualmente 750 es "arriba" en PDF-Lib.
            // Para el editor visual web, (0,0) es top-left.
            // Si pongo un elemento en top: 50px, eso equivale a y: 842 - 50 = 792 en PDF.
            // Haremos la conversión al guardar/cargar.

            content: "Nuevo Texto",
            fontSize: 12,
            font: "Helvetica",
            color: "#000000"
        };
        setObjects([...objects, newObj]);
        setSelectedId(newObj.id);
    };

    const handleMouseDown = (e, id) => {
        e.stopPropagation();
        setSelectedId(id);
        setDragId(id);
    };

    const handleMouseMove = (e) => {
        if (!dragId || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Actualizar posición del objeto arrastrado
        // Convertimos visual (top-left) a PDF (bottom-left) al vuelo? No, mejor mantenemos estado visual y convertimos solo al final/inicio.
        // Espera, si cargamos una template existente, viene en coordenadas PDF.
        // Mejor mantengamos todo en coordenadas PDF en el estado, y convertimos SOLO para el estilo 'top'.

        // Coordenada PDF X = x visual
        // Coordenada PDF Y = 842 - y visual

        const pdfX = x;
        const pdfY = 842 - y;

        setObjects(prev => prev.map(obj =>
            obj.id === dragId ? { ...obj, x: pdfX, y: pdfY } : obj
        ));
    };

    const handleMouseUp = () => {
        setDragId(null);
    };

    // Update object property
    const updateObject = (key, value) => {
        if (!selectedId) return;
        setObjects(prev => prev.map(obj =>
            obj.id === selectedId ? { ...obj, [key]: value } : obj
        ));
    };

    const handleSave = async () => {
        if (!name) return alert("Nombre requerido");

        const templateData = {
            name,
            templateJson: { objects }
        };

        try {
            await axios.post('/templates', templateData); // TODO: Manejar edición vs creación si el backend soporta PUT
            alert("Template guardada!");
            onSave();
        } catch (error) {
            console.error(error);
            alert("Error guardando template");
        }
    };

    const deleteSelected = () => {
        if (!selectedId) return;
        setObjects(prev => prev.filter(o => o.id !== selectedId));
        setSelectedId(null);
    }

    const selectedObject = objects.find(o => o.id === selectedId);

    return (
        <div className="container-fluid vh-100 d-flex flex-column" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="row border-bottom p-3 bg-white align-items-center">
                <div className="col-auto">
                    <button className="btn btn-outline-secondary" onClick={onBack}>
                        <i className="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control form-control-lg border-0 fw-bold"
                        placeholder="Nombre de la Template"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="col-auto">
                    <button className="btn btn-success" onClick={handleSave}>
                        <i className="fas fa-save me-2"></i>Guardar
                    </button>
                </div>
            </div>

            <div className="row flex-grow-1 overflow-hidden">
                {/* Sidebar Tools */}
                <div className="col-md-2 bg-light border-end p-3">
                    <h5>Herramientas</h5>
                    <button className="btn btn-outline-dark w-100 mb-2 text-start" onClick={addText}>
                        <i className="fas fa-font me-2"></i> Texto
                    </button>
                    <hr />
                    {selectedObject && (
                        <div>
                            <h6 className="text-primary">Propiedades</h6>
                            <div className="mb-2">
                                <label className="form-label small">Contenido</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={selectedObject.content}
                                    onChange={e => updateObject('content', e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small">Tamaño Fuente</label>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    value={selectedObject.fontSize}
                                    onChange={e => updateObject('fontSize', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small">Color</label>
                                <input
                                    type="color"
                                    className="form-control form-control-sm form-control-color w-100"
                                    value={selectedObject.color}
                                    onChange={e => updateObject('color', e.target.value)}
                                />
                            </div>
                            <div className="row mb-2">
                                <div className="col">
                                    <label className="form-label small">X</label>
                                    <input type="number" className="form-control form-control-sm" value={Math.round(selectedObject.x)} readOnly />
                                </div>
                                <div className="col">
                                    <label className="form-label small">Y</label>
                                    <input type="number" className="form-control form-control-sm" value={Math.round(selectedObject.y)} readOnly />
                                </div>
                            </div>
                            <button className="btn btn-danger btn-sm w-100 mt-2" onClick={deleteSelected}>
                                <i className="fas fa-trash me-2"></i>Eliminar
                            </button>
                        </div>
                    )}
                </div>

                {/* Canvas Area */}
                <div className="col-md-10 bg-secondary p-4 d-flex justify-content-center overflow-auto">
                    {/* A4 Size in px (approx 96 DPI): 794x1123. 
                        PDF points (1/72 inch): 595x842.
                        Vamos a usar las dimensiones PDF exactas para 1:1 mapping visual.
                    */}
                    <div
                        ref={canvasRef}
                        className="canvas-container"
                        style={{ width: '595px', height: '842px' }}
                    >
                        {objects.map(obj => (
                            <div
                                key={obj.id}
                                className={`draggable-item ${selectedId === obj.id ? 'selected' : ''}`}
                                style={{
                                    left: `${obj.x}px`,
                                    top: `${842 - obj.y}px`, // Invertir Y para display visual
                                    fontSize: `${obj.fontSize}px`,
                                    color: obj.color,
                                    fontFamily: obj.font === 'Helvetica-Bold' ? 'Helvetica, sans-serif' : 'Arial, sans-serif',
                                    fontWeight: obj.font === 'Helvetica-Bold' ? 'bold' : 'normal',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, obj.id)}
                            >
                                {obj.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- App Root ---

const App = () => {
    const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
    const [currentTemplate, setCurrentTemplate] = useState(null);

    const handleNew = () => {
        setCurrentTemplate(null);
        setView('create');
    };

    const handleEdit = (template) => {
        setCurrentTemplate(template);
        // Si tuviera ID real, podríamos hacer fetch fresh, pero usaremos lo que tenemos por ahora
        // Nota: en producción idealmente clonamos deep el objeto para no mutar el de la lista
        setView('create');
    };

    const handleSaveComplete = () => {
        setView('list');
    };

    return (
        <div>
            {view === 'list' && (
                <TemplateList
                    onNewTemplate={handleNew}
                    onSelectTemplate={handleEdit}
                />
            )}
            {view === 'create' && (
                <TemplateEditor
                    template={currentTemplate}
                    onBack={() => setView('list')}
                    onSave={handleSaveComplete}
                />
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
