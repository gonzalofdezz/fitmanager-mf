import { useState, useEffect } from 'react';
import { suscripcionService, Suscripcion } from '../../services/suscripcionService';
import { pagoService } from '../../services/pagoService';
import { useAuth } from '../../context/AuthContext';
import './SuscripcionList.css';

export function SuscripcionList() {
  const { usuario } = useAuth();
  const [suscripcionActiva, setSuscripcionActiva] = useState<Suscripcion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  const planes = [
    {
      id: 'BASICA',
      nombre: 'Plan Básico',
      precio: 9.99,
      duracion: 30,
      descripcion: '📱 Acceso básico al gimnasio',
      beneficios: ['Acceso a gimnasio', 'Horario limitado', 'Sin clases grupales'],
    },
    {
      id: 'PREMIUM',
      nombre: 'Plan Premium',
      precio: 19.99,
      duracion: 30,
      descripcion: '⭐ Acceso completo',
      beneficios: ['Acceso ilimitado', 'Horario completo', 'Clases grupales incluidas', 'Asesoramiento personalizado'],
    },
    {
      id: 'VIP',
      nombre: 'Plan VIP',
      precio: 29.99,
      duracion: 30,
      descripcion: '👑 Acceso total + soporte',
      beneficios: ['Todo de Premium', 'Entrenador personal', 'Nutricionista', 'Soporte 24/7'],
    },
  ];

  useEffect(() => {
    if (usuario?.id) {
      fetchSuscripcionActiva();
    }
  }, [usuario?.id]);

  const fetchSuscripcionActiva = async () => {
    if (!usuario?.id) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Traer SIEMPRE del backend primero (es la fuente de verdad)
      const data = await suscripcionService.listByUsuarioId(usuario.id);
      if (data.length > 0) {
        console.log('Suscripción cargada del backend:', data[0]);
        // Guardar en localStorage como respaldo
        localStorage.setItem(`suscripcion_${usuario.id}`, JSON.stringify(data[0]));
        setSuscripcionActiva(data[0]);
      } else {
        // 2. Si no hay en backend, el usuario NO tiene suscripción
        console.log('Usuario sin suscripción activa');
        setSuscripcionActiva(null);
        localStorage.removeItem(`suscripcion_${usuario.id}`);
      }
    } catch (err) {
      console.error('Error cargando suscripción del backend:', err);
      // Fallback: intentar usar localStorage si el backend falla
      const suscripcionLocal = localStorage.getItem(`suscripcion_${usuario.id}`);
      if (suscripcionLocal) {
        console.log('Fallback: usando suscripción del localStorage');
        setSuscripcionActiva(JSON.parse(suscripcionLocal));
      } else {
        console.log('No hay suscripción en localStorage tampoco');
        setSuscripcionActiva(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarSuscripcion = async () => {
    if (!suscripcionActiva?.id || !usuario?.id) return;

    if (!confirm('¿Estás seguro de que quieres cancelar tu suscripción? Ya no podrás crear clases.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Cancelando suscripción y cambiando a NINGUNA');

      // Cambiar a NINGUNA (sin suscripción)
      const suscripcionNinguna: Suscripcion = {
        id: suscripcionActiva.id,
        usuarioId: usuario.id,
        tipoPlan: 'NINGUNA',
        fechaInicio: new Date().toISOString(),
        fechaFin: new Date().toISOString(),
      };

      // Actualizar en el backend usando el endpoint PUT /suscripciones/{id}/plan
      try {
        await suscripcionService.updatePlan(suscripcionActiva.id, 'NINGUNA');
        console.log('Suscripción actualizada en el backend a NINGUNA');
      } catch (backendError) {
        console.log('Error actualizando en backend, pero continuamos:', backendError);
      }

      // Guardar en localStorage
      localStorage.setItem(`suscripcion_${usuario.id}`, JSON.stringify(suscripcionNinguna));

      // Actualizar el estado
      setSuscripcionActiva(suscripcionNinguna);

      // Mostrar mensaje de éxito
      setError(null);
    } catch (err) {
      setError('Error cancelando suscripción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComprarPlan = async (planId: string) => {
    if (!usuario?.id) return;

    setProcesandoPago(true);
    setError(null);

    try {
      console.log('Iniciando compra de plan:', planId);

      // Paso 1: Iniciar pago
      const pago = await pagoService.iniciar(usuario.id, planId);
      console.log('Pago iniciado:', pago);

      // Paso 2: Confirmar pago (en desarrollo, usar endpoint fake)
      if (pago.id) {
        const pagoConfirmado = await pagoService.confirmarFake(pago.id);
        console.log('Pago confirmado:', pagoConfirmado);

        // Paso 3: Esperar un poco y luego recargar la suscripción del backend
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Limpiar localStorage para forzar que traiga del backend
        localStorage.removeItem(`suscripcion_${usuario.id}`);

        // Recargar suscripción del backend
        setLoading(true);
        try {
          const data = await suscripcionService.listByUsuarioId(usuario.id);
          if (data.length > 0) {
            console.log('Suscripción actualizada desde el backend:', data[0]);
            localStorage.setItem(`suscripcion_${usuario.id}`, JSON.stringify(data[0]));
            setSuscripcionActiva(data[0]);
          }
        } catch (err) {
          console.error('Error recargando suscripción:', err);
        } finally {
          setLoading(false);
        }

        setPagoExitoso(true);
        setTimeout(() => setPagoExitoso(false), 5000);
      }
    } catch (err) {
      setError('Error al procesar la compra. Intenta de nuevo.');
      console.error('Error completo:', err);
    } finally {
      setProcesandoPago(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando información de suscripción...</div>;
  }

  return (
    <div className="suscripcion-list">
      <div className="list-header">
        <h2>Elige tu Plan de Suscripción</h2>
        <p className="subtitle">Acceso completo al gimnasio FitManager</p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {pagoExitoso && (
        <div className="success-banner">
          ✅ ¡Suscripción activada exitosamente! Disfruta de tu plan.
        </div>
      )}

      {suscripcionActiva && suscripcionActiva.tipoPlan !== 'NINGUNA' && (
        <div className="suscripcion-activa">
          <h3>Tu suscripción actual</h3>
          <div className="suscripcion-info">
            <p>
              <strong>Plan:</strong> {suscripcionActiva.tipoPlan}
            </p>
            {suscripcionActiva.fechaFin && (
              <p>
                <strong>Válido hasta:</strong> {new Date(suscripcionActiva.fechaFin).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            className="btn-cancelar-suscripcion"
            onClick={handleCancelarSuscripcion}
            disabled={loading}
          >
            ❌ Cancelar Suscripción
          </button>
        </div>
      )}

      <div className="planes-grid">
        {planes.map(plan => (
          <div key={plan.id} className="plan-card">
            <div className="plan-header">
              <h3>{plan.nombre}</h3>
              <p className="plan-description">{plan.descripcion}</p>
            </div>

            <div className="plan-price">
              <span className="precio">€{plan.precio}</span>
              <span className="duracion">/{plan.duracion} días</span>
            </div>

            <div className="plan-benefits">
              <p className="benefits-title">Incluye:</p>
              <ul>
                {plan.beneficios.map((beneficio, idx) => (
                  <li key={idx}>✓ {beneficio}</li>
                ))}
              </ul>
            </div>

            <button
              className="btn-comprar"
              onClick={() => handleComprarPlan(plan.id)}
              disabled={procesandoPago || (suscripcionActiva?.tipoPlan === plan.id)}
            >
              {procesandoPago ? '⏳ Procesando...' : suscripcionActiva?.tipoPlan === plan.id ? '✓ Plan Actual' : 'Comprar Ahora'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

