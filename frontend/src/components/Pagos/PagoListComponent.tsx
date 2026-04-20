import { useState } from 'react';
import { pagoService } from '../../services/pagoService';
import { useAuth } from '../../context/AuthContext';
import './PagoList.css';

export function PagoList() {
  const { usuario } = useAuth();
  const [plan, setPlan] = useState<'BASIC' | 'PREMIUM' | 'VIP'>('PREMIUM');
  const [procesando, setProcesando] = useState(false);
  const [pagoId, setPagoId] = useState<string | null>(null);
  const [estadoPago, setEstadoPago] = useState<'pendiente' | 'procesando' | 'completado' | 'error' | null>(null);

  const planes = {
    BASIC: { nombre: 'Plan Básico', precio: 9.99 },
    PREMIUM: { nombre: 'Plan Premium', precio: 19.99 },
    VIP: { nombre: 'Plan VIP', precio: 29.99 },
  };

  const handleIniciarPago = async () => {
    if (!usuario?.id) return;

    setProcesando(true);
    setEstadoPago('procesando');
    setPagoId(null);

    try {
      console.log('Intentando iniciar pago para usuario:', usuario.id, 'Plan:', plan);
      // Iniciar pago
      const pago = await pagoService.iniciar(usuario.id, plan);
      setPagoId(pago.id || null);
      console.log('Pago iniciado:', pago);
    } catch (err) {
      setEstadoPago('error');
      console.error('Error iniciando pago completo:', err);
    } finally {
      setProcesando(false);
    }
  };

  const handleConfirmarPago = async () => {
    if (!pagoId) return;

    setProcesando(true);
    setEstadoPago('procesando');

    try {
      // Confirmar pago (fake)
      const resultado = await pagoService.confirmarFake(pagoId);
      console.log('Pago confirmado:', resultado);
      setEstadoPago('completado');

      // Limpiar después de 3 segundos
      setTimeout(() => {
        setEstadoPago(null);
        setPagoId(null);
        setPlan('PREMIUM');
      }, 3000);
    } catch (err) {
      setEstadoPago('error');
      console.error('Error confirmando pago:', err);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="pago-list">
      <div className="list-header">
        <h2>Procesar Pago</h2>
        <p className="subtitle">Sistema de pagos para suscripciones</p>
      </div>

      <div className="pago-container">
        {estadoPago === 'completado' ? (
          <div className="pago-success">
            <h3>✅ ¡Pago Completado!</h3>
            <p>Tu suscripción ha sido activada exitosamente.</p>
            <p className="plan-text">Plan: <strong>{planes[plan].nombre}</strong></p>
            <p className="precio-text">Cantidad: <strong>€{planes[plan].precio}</strong></p>
          </div>
        ) : estadoPago === 'error' ? (
          <div className="pago-error">
            <h3>❌ Error en el Pago</h3>
            <p>Hubo un problema al procesar el pago. Intenta de nuevo.</p>
            <button
              className="btn-reintentar"
              onClick={() => {
                setEstadoPago(null);
                setPagoId(null);
              }}
            >
              Volver
            </button>
          </div>
        ) : pagoId ? (
          <div className="pago-confirmacion">
            <div className="pago-detalles">
              <h3>Confirmar Pago</h3>
              <div className="detalle-item">
                <span>Plan:</span>
                <strong>{planes[plan].nombre}</strong>
              </div>
              <div className="detalle-item">
                <span>Monto:</span>
                <strong>€{planes[plan].precio}</strong>
              </div>
              <div className="detalle-item">
                <span>ID de Pago:</span>
                <code>{pagoId}</code>
              </div>
            </div>

            <button
              className="btn-confirmar"
              onClick={handleConfirmarPago}
              disabled={procesando}
            >
              {procesando ? '⏳ Procesando...' : '✓ Confirmar Pago'}
            </button>

            <button
              className="btn-cancelar"
              onClick={() => {
                setEstadoPago(null);
                setPagoId(null);
              }}
              disabled={procesando}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="pago-seleccion">
            <h3>Selecciona un Plan</h3>

            <div className="planes-opciones">
              {Object.entries(planes).map(([key, value]) => (
                <div
                  key={key}
                  className={`opcion-plan ${plan === key ? 'activa' : ''}`}
                  onClick={() => setPlan(key as 'BASIC' | 'PREMIUM' | 'VIP')}
                >
                  <div className="opcion-nombre">{value.nombre}</div>
                  <div className="opcion-precio">€{value.precio}</div>
                </div>
              ))}
            </div>

            <div className="plan-info">
              <p>
                <strong>Plan Seleccionado:</strong> {planes[plan].nombre}
              </p>
              <p>
                <strong>Monto a Pagar:</strong> €{planes[plan].precio}
              </p>
            </div>

            <button
              className="btn-pagar"
              onClick={handleIniciarPago}
              disabled={procesando}
            >
              {procesando ? '⏳ Procesando...' : '💳 Proceder al Pago'}
            </button>
          </div>
        )}
      </div>

      <div className="pago-info">
        <h4>ℹ️ Información</h4>
        <p>
          Este es un sistema de pagos de prueba. En producción, se integraría con un procesador de pagos real
          como Stripe o PayPal.
        </p>
        <p>
          Los planes se renuevan automáticamente según su duración (BASIC: 30 días, PREMIUM: 60 días, VIP: 90
          días).
        </p>
      </div>
    </div>
  );
}


