const {Schema, model} = require('mongoose');
//const moment = require('moment-timezone');

const facturaSchema = new Schema({
    numero_factura:               {type: Number},
    orden_trabajo:                {type: Number},
    fecha_creacion:               {type: String},
    fecha_creacion_orden_trabajo: {type: String},
    cliente_nombre:               {type: String},
    cliente_apellido:             {type: String},
    cedula_RIF:                   {type: String},
    contacto_persona_convenio:    {type: String},
    telefono:                     {type: String},
    tipo_factura_nombre:          {type: String},
    id_factura:                   {type: Number},
    total_bolivares:              {type: Number},
    total_dolares:                {type: Number},
    total_pesos:                  {type: Number},
    descuento_dolares:            {type: Number},
    descuento_bolivares:          {type: Number},
    descuento_pesos:              {type: Number},
    valor_total_venta_bolivares:  {type: Number},
    valor_total_venta_dolares:    {type: Number},
    valor_total_venta_pesos:      {type: Number},
    IGTF_bolivares:               {type: Number},
    IGTF_pesos:                   {type: Number},
    IGTF_dolares:                 {type: Number}, 
    tasa_bolivar_dia:             {type: Number},
    tasa_pesos_dia:               {type: Number},
    total_pagar_bolivares:        {type: Number}, 
    total_pagar_pesos:            {type: Number},
    total_pagar_dolares:          {type: Number},
    base_imponible_dolares:       {type: Number}, 
    base_imponible_bolivares:     {type: Number},
    factura_qr:                   {type: String},
    cantidad_items:               {type: Number},
    pagos:                        [],
    items:                        [],
    ordenes:                      [],
    pacientes:                    [],
    subido:                       {type: Number}
});

facturas = model('facturas', facturaSchema, 'facturas');

module.exports = facturas;